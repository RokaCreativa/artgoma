// 🧭 MIGA DE PAN: EditItemDialog - Dialog para editar un item existente
// 📍 UBICACIÓN: src/app/[lang]/admin/sliders/components/EditItemDialog.tsx
// 🎯 PORQUÉ EXISTE: Editar propiedades de un item (título, URL, artistName) + subir imagen
// 🔄 FLUJO: Open with item → Edit fields OR Upload image → Save → Close
// 🚨 CUIDADO: No permite cambiar el tipo (youtube/image), solo editar datos
// 🔗 USA: /api/upload-images para subir a Supabase Storage (bucket: events)
// 📋 SPEC: SPEC-26-01-2026-CMS-ContentManager

"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2,
  Youtube,
  Image as ImageIcon,
  CheckCircle,
  ExternalLink,
  Upload,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { updateSliderItem } from "@/actions/cms/slider";
import {
  extractYouTubeId,
  getYouTubeThumbnail,
  getYouTubeWatchUrl,
} from "@/lib/cms/youtube";

interface SliderItem {
  id: number;
  sliderId: number;
  type: string;
  url: string | null;
  youtubeId: string | null;
  title: string | null;
  alt: string | null;
  artistName: string | null;
  width: number | null;
  height: number | null;
  position: number;
  isActive: boolean;
}

interface EditItemDialogProps {
  item: SliderItem;
  open: boolean;
  onClose: () => void;
}

export default function EditItemDialog({
  item,
  open,
  onClose,
}: EditItemDialogProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Form state
  const [url, setUrl] = useState(item.url || "");
  const [youtubeUrl, setYoutubeUrl] = useState(
    item.youtubeId ? `https://www.youtube.com/watch?v=${item.youtubeId}` : "",
  );
  const [title, setTitle] = useState(item.title || "");
  const [alt, setAlt] = useState(item.alt || "");
  const [artistName, setArtistName] = useState(item.artistName || "");

  // Preview state
  const [youtubeId, setYoutubeId] = useState<string | null>(item.youtubeId);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize preview
  useEffect(() => {
    if (item.type === "youtube" && item.youtubeId) {
      setPreviewUrl(getYouTubeThumbnail(item.youtubeId, "hqdefault"));
    } else if (item.url) {
      setPreviewUrl(item.url);
    }
  }, [item]);

  // Update preview when YouTube URL changes
  useEffect(() => {
    if (item.type === "youtube" && youtubeUrl) {
      const id = extractYouTubeId(youtubeUrl);
      setYoutubeId(id);
      if (id) {
        setPreviewUrl(getYouTubeThumbnail(id, "hqdefault"));
      }
    }
  }, [youtubeUrl, item.type]);

  // Update preview when image URL changes
  useEffect(() => {
    if (item.type === "image" && url) {
      setPreviewUrl(url);
    }
  }, [url, item.type]);

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const acceptedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (!acceptedTypes.includes(file.type)) {
      setUploadError("Solo se permiten imágenes PNG, JPG o WebP");
      return;
    }

    // Validate file size (4MB max)
    const maxSize = 4 * 1024 * 1024;
    if (file.size > maxSize) {
      setUploadError("La imagen no puede superar los 4MB");
      return;
    }

    setSelectedFile(file);
    setUploadError("");

    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Clear selected file
  const clearSelectedFile = () => {
    setSelectedFile(null);
    setUploadPreview(null);
    setUploadError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Upload image to Supabase
  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadError("");

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("bucket", "events"); // Usar bucket 'events' que ya existe

      const response = await fetch("/api/upload-images", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.status === "ok" && result.files?.[0]?.url) {
        // Update URL field with the uploaded image URL
        setUrl(result.files[0].url);
        setPreviewUrl(result.files[0].url);
        clearSelectedFile();
        setSuccess(false); // Reset success to allow saving
      } else {
        setUploadError(result.message || "Error al subir la imagen");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setUploadError("Error de conexión al subir la imagen");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess(false);

    // Prepare update data
    const updateData: {
      title?: string;
      alt?: string;
      artistName?: string;
      youtubeId?: string;
      url?: string;
    } = {
      title: title || undefined,
      alt: alt || undefined,
      artistName: artistName || undefined,
    };

    if (item.type === "youtube") {
      if (!youtubeId) {
        setError("URL de YouTube inválida");
        setIsLoading(false);
        return;
      }
      updateData.youtubeId = youtubeId;
    } else if (item.type === "image") {
      if (!url) {
        setError("La URL de la imagen es requerida");
        setIsLoading(false);
        return;
      }
      updateData.url = url;
    }

    const result = await updateSliderItem(item.id, updateData);

    setIsLoading(false);

    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        onClose();
        router.refresh();
      }, 500);
    } else {
      setError(result.error || "Error al actualizar item");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="bg-[#1c1f24] border-gray-800 text-white max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {item.type === "youtube" ? (
              <>
                <Youtube className="w-5 h-5 text-red-500" /> Editar Video
              </>
            ) : (
              <>
                <ImageIcon className="w-5 h-5 text-blue-500" /> Editar Imagen
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          {/* Preview */}
          {previewUrl && (
            <div className="relative">
              <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-900 border border-gray-700">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
                {item.type === "youtube" && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                      <div className="w-0 h-0 border-t-6 border-t-transparent border-l-10 border-l-white border-b-6 border-b-transparent ml-1" />
                    </div>
                  </div>
                )}
              </div>
              {item.type === "youtube" && youtubeId && (
                <a
                  href={getYouTubeWatchUrl(youtubeId)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute top-2 right-2 p-2 bg-black/50 rounded-lg text-white hover:bg-black/70 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          )}

          {/* URL input (depending on type) */}
          {item.type === "youtube" ? (
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                URL de YouTube
              </label>
              <input
                type="text"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                required
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full px-4 py-3 bg-[#0f1115] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              {youtubeId && (
                <p className="text-green-400 text-xs mt-2 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> ID: {youtubeId}
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {/* URL Input */}
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
                  className="w-full px-4 py-3 bg-[#0f1115] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-gray-700" />
                <span className="text-gray-500 text-sm">o subir nueva</span>
                <div className="flex-1 h-px bg-gray-700" />
              </div>

              {/* Upload Section */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Subir nueva imagen
                </label>

                {/* File Input Hidden */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                {/* Upload Preview or Button */}
                {uploadPreview ? (
                  <div className="relative">
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-900 border-2 border-dashed border-green-500">
                      <img
                        src={uploadPreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded">
                        Nueva imagen
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button
                        type="button"
                        onClick={handleUpload}
                        disabled={isUploading}
                        className="flex-1 bg-green-600 hover:bg-green-700"
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
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={clearSelectedFile}
                        disabled={isUploading}
                        className="text-gray-400 hover:text-white"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full px-4 py-6 bg-[#0f1115] border-2 border-dashed border-gray-700 rounded-xl text-gray-400 hover:border-red-500 hover:text-white transition-colors flex flex-col items-center gap-2"
                  >
                    <Upload className="w-6 h-6" />
                    <span>Seleccionar imagen</span>
                    <span className="text-xs text-gray-600">PNG, JPG, WebP (max 4MB)</span>
                  </button>
                )}

                {/* Upload Error */}
                {uploadError && (
                  <div className="mt-2 text-red-400 text-sm">
                    {uploadError}
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
              placeholder="Título descriptivo"
              className="w-full px-4 py-3 bg-[#0f1115] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Alt text (for images) */}
          {item.type === "image" && (
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Texto alternativo{" "}
                <span className="text-gray-600">(accesibilidad)</span>
              </label>
              <input
                type="text"
                value={alt}
                onChange={(e) => setAlt(e.target.value)}
                placeholder="Descripción para lectores de pantalla"
                className="w-full px-4 py-3 bg-[#0f1115] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          )}

          {/* Artist name */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Nombre del artista{" "}
              <span className="text-gray-600">(opcional)</span>
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
              <CheckCircle className="w-4 h-4" /> Cambios guardados
            </div>
          )}

          {/* Submit */}
          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
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
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Guardando...
                </>
              ) : (
                "Guardar cambios"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
