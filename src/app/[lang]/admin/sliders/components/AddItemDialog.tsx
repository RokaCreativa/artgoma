// 🧭 MIGA DE PAN: AddItemDialog - Dialog para agregar nuevo item al slider
// 📍 UBICACIÓN: src/app/[lang]/admin/sliders/components/AddItemDialog.tsx
// 🎯 PORQUÉ EXISTE: Agregar videos YouTube o imágenes con preview automático
// 🔄 FLUJO: Select type → Input URL → Preview → Save
// 🚨 CUIDADO: YouTube preview extrae ID automáticamente con youtube.ts utils
// 📋 SPEC: SPEC-26-01-2026-CMS-ContentManager

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Loader2,
  Youtube,
  Image as ImageIcon,
  X,
  CheckCircle,
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
  isValidYouTubeInput,
} from "@/lib/cms/youtube";

interface AddItemDialogProps {
  sliderId: number;
}

type ItemType = "youtube" | "image";

export default function AddItemDialog({ sliderId }: AddItemDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Form state
  const [itemType, setItemType] = useState<ItemType>("youtube");
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [artistName, setArtistName] = useState("");

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
    } else if (itemType === "image" && url) {
      setPreviewUrl(url);
      setYoutubeId(null);
    } else {
      setPreviewUrl(null);
      setYoutubeId(null);
    }
  }, [url, itemType]);

  // Reset form when dialog closes
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      resetForm();
    }
  };

  const resetForm = () => {
    setItemType("youtube");
    setUrl("");
    setTitle("");
    setArtistName("");
    setYoutubeId(null);
    setPreviewUrl(null);
    setError("");
    setSuccess(false);
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
        setError("La URL de la imagen es requerida");
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
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border transition-all ${
                itemType === "image"
                  ? "bg-blue-600 border-blue-600 text-white"
                  : "bg-transparent border-gray-700 text-gray-400 hover:border-gray-600"
              }`}
            >
              <ImageIcon className="w-5 h-5" />
              Imagen URL
            </button>
          </div>

          {/* URL input */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              {itemType === "youtube" ? "URL de YouTube" : "URL de la imagen"}
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              placeholder={
                itemType === "youtube"
                  ? "https://www.youtube.com/watch?v=... o youtu.be/..."
                  : "https://ejemplo.com/imagen.jpg"
              }
              className="w-full px-4 py-3 bg-[#0f1115] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            {itemType === "youtube" && url && !youtubeId && (
              <p className="text-yellow-400 text-xs mt-2">
                No se pudo detectar el ID del video. Verifica la URL.
              </p>
            )}
            {itemType === "youtube" && youtubeId && (
              <p className="text-green-400 text-xs mt-2 flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> ID detectado: {youtubeId}
              </p>
            )}
          </div>

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
