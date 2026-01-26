// 🧭 MIGA DE PAN: CreateSliderDialog - Dialog para crear nuevo slider
// 📍 UBICACIÓN: src/app/[lang]/admin/sliders/components/CreateSliderDialog.tsx
// 🎯 PORQUÉ EXISTE: Formulario modal para crear sliders nuevos
// 📋 SPEC: SPEC-26-01-2026-CMS-ContentManager

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createSlider } from "@/actions/cms/slider";

interface CreateSliderDialogProps {
  lang: string;
}

const sections = [
  { value: "stories", label: "Historias (Videos)" },
  { value: "artists", label: "Artistas" },
  { value: "brands", label: "Marcas/Sponsors" },
  { value: "live", label: "Live Painting" },
];

export default function CreateSliderDialog({ lang }: CreateSliderDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const section = formData.get("section") as string;

    // Generar slug desde el nombre
    const slug = name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const result = await createSlider({
      name,
      slug,
      section,
      isActive: true,
      position: 0,
    });

    setIsLoading(false);

    if (result.success && result.data) {
      setOpen(false);
      router.push(`/${lang}/admin/sliders/${result.data.id}`);
    } else {
      setError(result.error || "Error al crear slider");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-red-600 hover:bg-red-700 text-white">
          <Plus className="w-4 h-4 mr-2" /> Nuevo Slider
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#1c1f24] border-gray-800 text-white">
        <DialogHeader>
          <DialogTitle>Crear nuevo slider</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Nombre */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Nombre</label>
            <input
              type="text"
              name="name"
              required
              placeholder="Ej: Videos de Historias"
              className="w-full px-4 py-2 bg-[#0f1115] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Sección */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Sección</label>
            <select
              name="section"
              required
              className="w-full px-4 py-2 bg-[#0f1115] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">Selecciona una sección</option>
              {sections.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          {/* Error */}
          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}

          {/* Submit */}
          <div className="flex justify-end gap-3 pt-4">
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
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {isLoading ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creando...</>
              ) : (
                "Crear slider"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
