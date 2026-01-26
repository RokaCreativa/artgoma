// 🧭 MIGA DE PAN: SliderSettings - Dropdown para configuración del slider
// 📍 UBICACIÓN: src/app/[lang]/admin/sliders/components/SliderSettings.tsx
// 🎯 PORQUÉ EXISTE: Editar nombre, toggle activo/inactivo, eliminar slider
// 🔄 FLUJO: Click settings → Dropdown menu → Actions
// 📋 SPEC: SPEC-26-01-2026-CMS-ContentManager

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Settings, Pencil, Eye, EyeOff, Trash2, Loader2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { updateSlider, deleteSlider } from "@/actions/cms/slider";

interface Slider {
  id: number;
  name: string;
  slug: string;
  section: string;
  isActive: boolean;
}

interface SliderSettingsProps {
  slider: Slider;
}

export default function SliderSettings({ slider }: SliderSettingsProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editName, setEditName] = useState(slider.name);
  const [error, setError] = useState("");

  const handleToggleActive = async () => {
    setIsLoading(true);
    await updateSlider(slider.id, { isActive: !slider.isActive });
    setIsLoading(false);
    router.refresh();
  };

  const handleDelete = async () => {
    if (!confirm(`¿Eliminar slider "${slider.name}"? Se eliminarán todos sus items. Esta acción no se puede deshacer.`)) {
      return;
    }
    setIsLoading(true);
    await deleteSlider(slider.id);
    router.push(`/${window.location.pathname.split('/')[1]}/admin/sliders`);
  };

  const handleEditName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) {
      setError("El nombre es requerido");
      return;
    }

    setIsLoading(true);
    setError("");

    // Generate new slug from name
    const newSlug = editName
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const result = await updateSlider(slider.id, {
      name: editName,
      slug: newSlug,
    });

    setIsLoading(false);

    if (result.success) {
      setEditDialogOpen(false);
      router.refresh();
    } else {
      setError(result.error || "Error al actualizar");
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="bg-[#1c1f24] border-gray-700 text-gray-400 hover:text-white hover:border-gray-600"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Settings className="w-4 h-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-[#2a2d35] border-gray-700 min-w-[180px]">
          <DropdownMenuItem
            onClick={() => setEditDialogOpen(true)}
            className="text-gray-300 hover:text-white hover:bg-gray-700 cursor-pointer"
          >
            <Pencil className="w-4 h-4 mr-2" /> Editar nombre
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={handleToggleActive}
            className="text-gray-300 hover:text-white hover:bg-gray-700 cursor-pointer"
          >
            {slider.isActive ? (
              <><EyeOff className="w-4 h-4 mr-2" /> Desactivar</>
            ) : (
              <><Eye className="w-4 h-4 mr-2" /> Activar</>
            )}
          </DropdownMenuItem>

          <DropdownMenuSeparator className="bg-gray-700" />

          <DropdownMenuItem
            onClick={handleDelete}
            className="text-red-400 hover:text-red-300 hover:bg-red-500/10 cursor-pointer"
          >
            <Trash2 className="w-4 h-4 mr-2" /> Eliminar slider
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Edit Name Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="bg-[#1c1f24] border-gray-800 text-white max-w-md">
          <DialogHeader>
            <DialogTitle>Editar nombre del slider</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleEditName} className="space-y-4 mt-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Nombre</label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                required
                autoFocus
                className="w-full px-4 py-3 bg-[#0f1115] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setEditDialogOpen(false);
                  setEditName(slider.name);
                  setError("");
                }}
                className="text-gray-400 hover:text-white"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-red-600 hover:bg-red-700"
              >
                {isLoading ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Guardando...</>
                ) : (
                  "Guardar"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
