// 🧭 MIGA DE PAN: EditItemDialog - Dialog para editar un item existente
// 📍 UBICACIÓN: src/app/[lang]/admin/sliders/components/EditItemDialog.tsx
// 🎯 PORQUÉ EXISTE: Editar propiedades de un item (título, URL, artistName)
// 🔄 FLUJO: Open with item → Edit fields → Save → Close
// 🚨 CUIDADO: No permite cambiar el tipo (youtube/image), solo editar datos
// 📋 SPEC: SPEC-26-01-2026-CMS-ContentManager

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2,
  Youtube,
  Image as ImageIcon,
  CheckCircle,
  ExternalLink,
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
