// 🧭 MIGA DE PAN: Sliders List Page - Lista de todos los sliders
// 📍 UBICACIÓN: src/app/[lang]/admin/sliders/page.tsx
// 🎯 PORQUÉ EXISTE: Ver, crear y gestionar sliders del CMS
// 🔄 FLUJO: Load sliders → Display grid → CRUD actions
// 📋 SPEC: SPEC-26-01-2026-CMS-ContentManager

import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/cms/auth";
import { getSliders } from "@/actions/cms/slider";
import { Locale } from "@/configs/i18n.config";
import { Images } from "lucide-react";
import SliderCard from "./components/SliderCard";
import CreateSliderDialog from "./components/CreateSliderDialog";

interface SlidersPageProps {
  params: Promise<{ lang: Locale }>;
}

// Tipo para el slider con count
type SliderWithCount = Awaited<ReturnType<typeof getSliders>>[number];

// Mapeo de sección a nombre de icono (string) - FIX Next.js 16 serialization
const sectionIconNames: Record<string, string> = {
  hero: "layout-dashboard",
  stories: "video",
  artists: "users",
  brands: "award",
  live: "images",
  tickets: "ticket",
  default: "images",
};

export default async function SlidersPage({ params }: SlidersPageProps) {
  const { lang } = await params;

  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    redirect(`/${lang}/admin/login`);
  }

  const sliders = await getSliders();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Sliders</h1>
          <p className="text-gray-400 text-sm mt-1">
            Gestiona los carruseles de la web
          </p>
        </div>

        <CreateSliderDialog lang={lang} />
      </div>

      {/* Sliders grid */}
      {sliders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sliders.map((slider: SliderWithCount) => (
            <SliderCard
              key={slider.id}
              slider={slider}
              lang={lang}
              iconName={sectionIconNames[slider.section] || sectionIconNames.default}
            />
          ))}
        </div>
      ) : (
        /* Empty state */
        <div className="bg-[#1c1f24] border border-gray-800 border-dashed rounded-2xl p-12 text-center">
          <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Images className="w-8 h-8 text-gray-600" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">
            No hay sliders todavía
          </h3>
          <p className="text-gray-400 text-sm mb-6">
            Crea tu primer slider para empezar a gestionar contenido
          </p>
          <CreateSliderDialog lang={lang} />
        </div>
      )}

      {/* Info cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
        <div className="bg-[#1c1f24] border border-gray-800 rounded-xl p-4">
          <h3 className="text-white font-medium mb-2">📹 Videos de YouTube</h3>
          <p className="text-gray-400 text-sm">
            Pega cualquier URL de YouTube y se procesará automáticamente. Sin
            necesidad de subir archivos.
          </p>
        </div>
        <div className="bg-[#1c1f24] border border-gray-800 rounded-xl p-4">
          <h3 className="text-white font-medium mb-2">🖼️ Imágenes</h3>
          <p className="text-gray-400 text-sm">
            Usa URLs de imágenes existentes o sube nuevas a Supabase
            directamente desde el editor.
          </p>
        </div>
      </div>
    </div>
  );
}
