// 🧭 MIGA DE PAN: SliderItemsList - Lista de items con drag & drop
// 📍 UBICACIÓN: src/app/[lang]/admin/sliders/components/SliderItemsList.tsx
// 🎯 PORQUÉ EXISTE: Mostrar items del slider con reordenamiento drag&drop nativo
// 🔄 FLUJO: Items → Drag&Drop → reorderSliderItems() → Update positions
// 🚨 CUIDADO: Usa HTML5 Drag API nativa, NO librerías externas
// 📋 SPEC: SPEC-26-01-2026-CMS-ContentManager

"use client";

import { useState, useRef } from "react";
import {
  GripVertical,
  Youtube,
  Image as ImageIcon,
  Eye,
  EyeOff,
  Trash2,
  Pencil,
  ExternalLink,
} from "lucide-react";
import {
  reorderSliderItems,
  deleteSliderItem,
  toggleSliderItemActive,
} from "@/actions/cms/slider";
import { getYouTubeThumbnail, getYouTubeWatchUrl } from "@/lib/cms/youtube";
import EditItemDialog from "./EditItemDialog";

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

interface SliderItemsListProps {
  items: SliderItem[];
  sliderId: number;
}

export default function SliderItemsList({
  items: initialItems,
  sliderId,
}: SliderItemsListProps) {
  const [items, setItems] = useState(initialItems);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [isReordering, setIsReordering] = useState(false);
  const [editingItem, setEditingItem] = useState<SliderItem | null>(null);

  // Drag handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    // Necesario para Firefox
    e.dataTransfer.setData("text/plain", index.toString());
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (draggedIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = async (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    setDragOverIndex(null);

    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      return;
    }

    // Reordenar localmente primero (optimistic update)
    const newItems = [...items];
    const [draggedItem] = newItems.splice(draggedIndex, 1);
    newItems.splice(dropIndex, 0, draggedItem);
    setItems(newItems);
    setDraggedIndex(null);

    // Guardar en BD
    setIsReordering(true);
    const itemIds = newItems.map((item) => item.id);
    await reorderSliderItems(sliderId, itemIds);
    setIsReordering(false);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  // Actions
  const handleToggleActive = async (item: SliderItem) => {
    // Optimistic update
    setItems(
      items.map((i) =>
        i.id === item.id ? { ...i, isActive: !i.isActive } : i,
      ),
    );
    await toggleSliderItemActive(item.id);
  };

  const handleDelete = async (item: SliderItem) => {
    if (!confirm(`¿Eliminar este item? Esta acción no se puede deshacer.`)) {
      return;
    }
    // Optimistic update
    setItems(items.filter((i) => i.id !== item.id));
    await deleteSliderItem(item.id);
  };

  // Get thumbnail for item
  const getThumbnail = (item: SliderItem): string => {
    if (item.type === "youtube" && item.youtubeId) {
      return getYouTubeThumbnail(item.youtubeId, "mqdefault");
    }
    if (item.url) {
      return item.url;
    }
    return "/placeholder-image.jpg";
  };

  // Get external URL for item
  const getExternalUrl = (item: SliderItem): string | null => {
    if (item.type === "youtube" && item.youtubeId) {
      return getYouTubeWatchUrl(item.youtubeId);
    }
    if (item.url) {
      return item.url;
    }
    return null;
  };

  if (items.length === 0) {
    return (
      <div className="bg-[#1c1f24] border border-gray-800 border-dashed rounded-2xl p-12 text-center">
        <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <ImageIcon className="w-8 h-8 text-gray-600" />
        </div>
        <h3 className="text-lg font-medium text-white mb-2">
          No hay items todavía
        </h3>
        <p className="text-gray-400 text-sm">
          Agrega videos de YouTube o imágenes para empezar
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {/* Reordering indicator */}
        {isReordering && (
          <div className="bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm px-4 py-2 rounded-lg">
            Guardando orden...
          </div>
        )}

        {/* Items list */}
        {items.map((item, index) => (
          <div
            key={item.id}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, index)}
            onDragEnd={handleDragEnd}
            className={`
              bg-[#1c1f24] border rounded-xl p-4 flex items-center gap-4 transition-all cursor-move
              ${draggedIndex === index ? "opacity-50 scale-95" : ""}
              ${dragOverIndex === index ? "border-red-500 bg-red-500/5" : "border-gray-800 hover:border-gray-700"}
              ${!item.isActive ? "opacity-60" : ""}
            `}
          >
            {/* Drag handle */}
            <div className="text-gray-500 hover:text-gray-300 cursor-grab active:cursor-grabbing">
              <GripVertical className="w-5 h-5" />
            </div>

            {/* Thumbnail */}
            <div className="w-24 h-16 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0 relative">
              <img
                src={getThumbnail(item)}
                alt={item.alt || item.title || "Item"}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='64' viewBox='0 0 96 64'%3E%3Crect fill='%231c1f24' width='96' height='64'/%3E%3Ctext fill='%234b5563' font-size='12' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3ENo img%3C/text%3E%3C/svg%3E";
                }}
              />
              {/* Type badge */}
              <div
                className={`absolute top-1 left-1 w-6 h-6 rounded flex items-center justify-center ${
                  item.type === "youtube" ? "bg-red-600" : "bg-blue-600"
                }`}
              >
                {item.type === "youtube" ? (
                  <Youtube className="w-3 h-3 text-white" />
                ) : (
                  <ImageIcon className="w-3 h-3 text-white" />
                )}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-medium truncate">
                {item.title ||
                  item.artistName ||
                  (item.type === "youtube" ? "Video YouTube" : "Imagen")}
              </h3>
              <p className="text-gray-500 text-sm truncate">
                {item.type === "youtube" &&
                  item.youtubeId &&
                  `ID: ${item.youtubeId}`}
                {item.type === "image" && item.url && item.url.substring(0, 50)}
                {item.artistName && ` · ${item.artistName}`}
              </p>
            </div>

            {/* Position badge */}
            <div className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">
              #{index + 1}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1">
              {/* External link */}
              {getExternalUrl(item) && (
                <a
                  href={getExternalUrl(item)!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-500 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}

              {/* Toggle active */}
              <button
                onClick={() => handleToggleActive(item)}
                className={`p-2 rounded-lg transition-colors ${
                  item.isActive
                    ? "text-green-400 hover:bg-green-500/10"
                    : "text-gray-500 hover:bg-gray-800"
                }`}
                title={item.isActive ? "Desactivar" : "Activar"}
              >
                {item.isActive ? (
                  <Eye className="w-4 h-4" />
                ) : (
                  <EyeOff className="w-4 h-4" />
                )}
              </button>

              {/* Edit */}
              <button
                onClick={() => setEditingItem(item)}
                className="p-2 text-gray-500 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                title="Editar"
              >
                <Pencil className="w-4 h-4" />
              </button>

              {/* Delete */}
              <button
                onClick={() => handleDelete(item)}
                className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                title="Eliminar"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Dialog */}
      {editingItem && (
        <EditItemDialog
          item={editingItem}
          open={!!editingItem}
          onClose={() => setEditingItem(null)}
        />
      )}
    </>
  );
}
