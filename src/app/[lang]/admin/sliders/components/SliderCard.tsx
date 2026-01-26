// 🧭 MIGA DE PAN: SliderCard - Card para mostrar un slider en la lista
// 📍 UBICACIÓN: src/app/[lang]/admin/sliders/components/SliderCard.tsx
// 🎯 PORQUÉ EXISTE: Visualizar info de slider con acciones rápidas
// 📋 SPEC: SPEC-26-01-2026-CMS-ContentManager
// 🚨 FIX 26-01-2026: iconName string instead of LucideIcon to fix Next.js 16 Server->Client serialization

"use client";

import Link from "next/link";
import { Images, Video, Users, Award, MoreVertical, Pencil, Trash2, Eye, EyeOff, LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { updateSlider, deleteSlider } from "@/actions/cms/slider";
import { useState } from "react";

// Mapa de iconos - resuelve el problema de serialización Server->Client en Next.js 16
const iconMap: Record<string, LucideIcon> = {
  video: Video,
  users: Users,
  award: Award,
  images: Images,
};

interface SliderCardProps {
  slider: {
    id: number;
    name: string;
    slug: string;
    section: string;
    isActive: boolean;
    _count: { items: number };
  };
  lang: string;
  iconName: string; // Ahora recibe string, no componente
}

export default function SliderCard({ slider, lang, iconName }: SliderCardProps) {
  // Resolver icono desde el mapa
  const Icon = iconMap[iconName] || Images;
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleActive = async () => {
    setIsLoading(true);
    await updateSlider(slider.id, { isActive: !slider.isActive });
    setIsLoading(false);
  };

  const handleDelete = async () => {
    if (!confirm(`¿Eliminar slider "${slider.name}"? Esta acción no se puede deshacer.`)) {
      return;
    }
    setIsLoading(true);
    await deleteSlider(slider.id);
    setIsLoading(false);
  };

  return (
    <div className={`bg-[#1c1f24] border rounded-2xl p-6 transition-all hover:shadow-lg ${
      slider.isActive ? "border-gray-800 hover:border-gray-700" : "border-gray-800/50 opacity-60"
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
          slider.isActive ? "bg-red-500" : "bg-gray-700"
        }`}>
          <Icon className="w-5 h-5 text-white" />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-[#2a2d35] border-gray-700">
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
            <DropdownMenuItem
              onClick={handleDelete}
              className="text-red-400 hover:text-red-300 hover:bg-gray-700 cursor-pointer"
            >
              <Trash2 className="w-4 h-4 mr-2" /> Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Content */}
      <h3 className="text-white font-semibold mb-1">{slider.name}</h3>
      <p className="text-gray-500 text-sm mb-4">Sección: {slider.section}</p>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">
          {slider._count.items} {slider._count.items === 1 ? "item" : "items"}
        </span>
        <Link
          href={`/${lang}/admin/sliders/${slider.id}`}
          className="text-sm text-red-500 hover:text-red-400 flex items-center gap-1"
        >
          <Pencil className="w-3 h-3" /> Editar
        </Link>
      </div>
    </div>
  );
}
