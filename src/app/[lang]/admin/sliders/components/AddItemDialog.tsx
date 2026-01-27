// 🧭 MIGA DE PAN: AddItemDialog - Dialog para agregar nuevo item al slider
// 📍 UBICACIÓN: src/app/[lang]/admin/sliders/components/AddItemDialog.tsx
// 🎯 PORQUÉ EXISTE: Agregar videos YouTube o imágenes con preview automático
// 🔄 FLUJO: Select type → Input URL/Upload → Preview → Save
// 🚨 CUIDADO: YouTube preview extrae ID automáticamente con youtube.ts utils
// 🚨 CUIDADO: Upload usa /api/upload-images con bucket 'events'
// 📋 SPEC: SPEC-26-01-2026-CMS-ContentManager

"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Loader2,
  Youtube,
  Image as ImageIcon,
  X,
  CheckCircle,
  Upload,
  Link as LinkIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createSliderItem } from "@/actions/cms/slider";
import {
  extractYouTubeId,
  getYouTubeThumbnail,
} from "@/lib/cms/youtube";

interface AddItemDialogProps {
  sliderId: number;
}

type ItemType = "youtube" | "image";
type ImageMode = "url" | "upload";

export default function AddItemDialog({ sliderId }: AddItemDialogProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Form state
  const [itemType, setItemType] = useState<ItemType>("youtube");
  const [imageMode, setImageMode] = useState<ImageMode>("url");
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [artistName, setArtistName] = useState("");

  // Upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  // Preview state
  const [youtubeId, setYoutubeId] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Auto-extract YouTube ID when URL changes
  useEffect(() => {
    if (itemType === "youtube" && url) {
      const id = extractYouTubeId(url);
      setYoutubeId(id);
      if (id) {
        setPreviewUrl(getYouTubeThumbnail(id, "hqdefault"));
      } else {
        setPreviewUrl(null);
      }
    } else if (itemType === "image") {
      if (imageMode === "url" && url) {
        setPreviewUrl(url);
      } else if (imageMode === "upload" && selectedFile) {
        // Preview from local file
        const objectUrl = URL.createObjectURL(selectedFile);
        setPreviewUrl(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
      } else if (uploadedUrl) {
        setPreviewUrl(uploadedUrl);
      } else {
        setPreviewUrl(null);
      }
      setYoutubeId(null);
    } else {
      setPreviewUrl(null);
      setYoutubeId(null);
    }
  }, [url, itemType, imageMode, selectedFile, uploadedUrl]);

  // Reset form when dialog closes
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      resetForm();
    }
  };

  const resetForm = () => {
    setItemType("youtube");
    setImageMode("url");
    setUrl("");
    setTitle("");
    setArtistName("");
    setYoutubeId(null);
    setPreviewUrl(null);
    setSelectedFile(null);
    setUploadedUrl(null);
    setError("");
    setSuccess(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Solo se permiten archivos de imagen");
        return;
      }
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setError("El archivo no puede superar los 5MB");
        return;
      }
      setSelectedFile(file);
      setUploadedUrl(null);
      setError("");
    }
  };

  // Upload file to Supabase
  const handleUploadFile = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("bucket", "events");
      formData.append("path", "sliders");

      const response = await fetch("/api/upload-images", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.status === "ok" && result.files?.[0]?.url) {
        setUploadedUrl(result.files[0].url);
        setUrl(result.files[0].url); // Set the URL for the form submission
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        setError(result.message || "Error al subir la imagen");
      }
    } catch (err) {
      setError("Error de conexión al subir la imagen");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess(false);

    // Validate
    if (itemType === "youtube") {
      if (!youtubeId) {
        setError("URL de YouTube inválida. Pega el link completo del video.");
        setIsLoading(false);
        return;
      }
    } else if (itemType === "image") {
      if (!url) {
        if (imageMode === "upload") {
          setError("Primero sube una imagen usando el botón 'Subir imagen'");
        } else {
          setError("La URL de la imagen es requerida");
        }
        setIsLoading(false);
        return;
      }
    }

    const result = await createSliderItem({
      sliderId,
      type: itemType,
      url: itemType === "image" ? url : undefined,
      youtubeId: itemType === "youtube" ? (youtubeId ?? undefined) : undefined,
      title: title || undefined,
      artistName: artistName || undefined,
      isActive: true,
      position: 0, // Se asigna automáticamente al final
    });

    setIsLoading(false);

    if (result.success) {
      setSuccess(true);
      // Mostrar success por un momento antes de cerrar
      setTimeout(() => {
        setOpen(false);
        resetForm();
        router.refresh();
      }, 500);
    } else {
      setError(result.error || "Error al agregar item");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-red-600 hover:bg-red-700 text-white">
          <Plus className="w-4 h-4 mr-2" /> Agregar Item
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#1c1f24] border-gray-800 text-white max-w-lg">
        <DialogHeader>
          <DialogTitle>Agregar nuevo item</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          {/* Type tabs */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setItemType("youtube");
                setUrl("");
                setSelectedFile(null);
                setUploadedUrl(null);
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border transition-all ${
                itemType === "youtube"
                  ? "bg-red-600 border-red-600 text-white"
                  : "bg-transparent border-gray-700 text-gray-400 hover:border-gray-600"
              }`}
            >
              <Youtube className="w-5 h-5" />
              YouTube
            </button>
            <button
              type="button"
              onClick={() => {
                setItemType("image");
                setUrl("");
                setSelectedFile(null);
                setUploadedUrl(null);
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border transition-all ${
                itemType === "image"
                  ? "bg-blue-600 border-blue-600 text-white"
                  : "bg-transparent border-gray-700 text-gray-400 hover:border-gray-600"
              }`}
            >
              <ImageIcon className="w-5 h-5" />
              Imagen
            </button>
          </div>

          {/* Image mode selector (only when image type) */}
          {itemType === "image" && (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setImageMode("url");
                  setSelectedFile(null);
                  setUploadedUrl(null);
                  setUrl("");
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg border text-sm transition-all ${
                  imageMode === "url"
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-transparent border-gray-700 text-gray-400 hover:border-gray-600"
                }`}
              >
                <LinkIcon className="w-4 h-4" />
                Pegar URL
              </button>
              <button
                type="button"
                onClick={() => {
                  setImageMode("upload");
                  setUrl("");
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg border text-sm transition-all ${
                  imageMode === "upload"
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-transparent border-gray-700 text-gray-400 hover:border-gray-600"
                }`}
              >
                <Upload className="w-4 h-4" />
                Subir imagen
              </button>
            </div>
          )}

          {/* YouTube URL input */}
          {itemType === "youtube" && (
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                URL de YouTube
              </label>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                placeholder="https://www.youtube.com/watch?v=... o youtu.be/..."
                className="w-full px-4 py-3 bg-[#0f1115] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              {url && !youtubeId && (
                <p className="text-yellow-400 text-xs mt-2">
                  No se pudo detectar el ID del video. Verifica la URL.
                </p>
              )}
              {youtubeId && (
                <p className="text-green-400 text-xs mt-2 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> ID detectado: {youtubeId}
                </p>
              )}
            </div>
          )}

          {/* Image URL input */}
          {itemType === "image" && imageMode === "url" && (
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                URL de la imagen
              </label>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                placeholder="https://ejemplo.com/imagen.jpg"
                className="w-full px-4 py-3 bg-[#0f1115] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {/* Image Upload */}
          {itemType === "image" && imageMode === "upload" && (
            <div className="space-y-3">
              <label className="block text-sm text-gray-400 mb-2">
                Seleccionar imagen
              </label>

              {/* File input */}
              <div className="relative">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className={`flex flex-col items-center justify-center w-full py-6 px-4 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                    selectedFile
                      ? "border-blue-500 bg-blue-500/10"
                      : "border-gray-700 hover:border-gray-600 bg-[#0f1115]"
                  }`}
                >
                  {selectedFile ? (
                    <>
                      <ImageIcon className="w-8 h-8 text-blue-400 mb-2" />
                      <span className="text-sm text-white font-medium truncate max-w-full px-2">
                        {selectedFile.name}
                      </span>
                      <span className="text-xs text-gray-400 mt-1">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-gray-500 mb-2" />
                      <span className="text-sm text-gray-400">
                        Click para seleccionar imagen
                      </span>
                      <span className="text-xs text-gray-500 mt-1">
                        JPG, PNG, GIF, WEBP (max 5MB)
                      </span>
                    </>
                  )}
                </label>
              </div>

              {/* Upload button */}
              {selectedFile && !uploadedUrl && (
                <Button
                  type="button"
                  onClick={handleUploadFile}
                  disabled={isUploading}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Subiendo...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Subir imagen
                    </>
                  )}
                </Button>
              )}

              {/* Upload success */}
              {uploadedUrl && (
                <div className="flex items-center gap-2 text-green-400 text-sm bg-green-500/10 border border-green-500/20 px-3 py-2 rounded-lg">
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">Imagen subida correctamente</span>
                </div>
              )}
            </div>
          )}

          {/* Preview */}
          {previewUrl && (
            <div className="relative">
              <label className="block text-sm text-gray-400 mb-2">
                Vista previa
              </label>
              <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-900 border border-gray-700">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
                {itemType === "youtube" && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
                      <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-white border-b-8 border-b-transparent ml-1" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Título <span className="text-gray-600">(opcional)</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título descriptivo del item"
              className="w-full px-4 py-3 bg-[#0f1115] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Artist name (for artists slider) */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Nombre del artista{" "}
              <span className="text-gray-600">
                (opcional, para slider de artistas)
              </span>
            </label>
            <input
              type="text"
              value={artistName}
              onChange={(e) => setArtistName(e.target.value)}
              placeholder="Nombre del artista"
              className="w-full px-4 py-3 bg-[#0f1115] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="bg-green-500/10 border border-green-500/20 text-green-400 text-sm px-4 py-3 rounded-xl flex items-center gap-2">
              <CheckCircle className="w-4 h-4" /> Item agregado correctamente
            </div>
          )}

          {/* Submit */}
          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
              className="text-gray-400 hover:text-white"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading || success}
              className="bg-red-600 hover:bg-red-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Agregando...
                </>
              ) : (
                "Agregar item"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
