// 🧭 MIGA DE PAN: Slider Editor Page - Editor completo de un slider
// 📍 UBICACIÓN: src/app/[lang]/admin/sliders/[id]/page.tsx
// 🎯 PORQUÉ EXISTE: Editar slider, gestionar items con drag&drop, agregar YouTube/imágenes
// 🔄 FLUJO: Load slider → Display items → CRUD items → Reorder drag&drop
// 🚨 CUIDADO: El reorder usa HTML5 drag API nativa, no librerías externas
// 📋 SPEC: SPEC-26-01-2026-CMS-ContentManager

import { redirect, notFound } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/cms/auth";
import { getSliderById } from "@/actions/cms/slider";
import { Locale } from "@/configs/i18n.config";
import Link from "next/link";
import { ArrowLeft, Settings } from "lucide-react";
import SliderItemsList from "../components/SliderItemsList";
import AddItemDialog from "../components/AddItemDialog";
import SliderSettings from "../components/SliderSettings";

interface SliderEditorPageProps {
  params: Promise<{ lang: Locale; id: string }>;
}

export default async function SliderEditorPage({
  params,
}: SliderEditorPageProps) {
  const { lang, id } = await params;
  const sliderId = parseInt(id, 10);

  if (isNaN(sliderId)) {
    notFound();
  }

  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    redirect(`/${lang}/admin/login`);
  }

  const slider = await getSliderById(sliderId);

  if (!slider) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href={`/${lang}/admin/sliders`}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#1c1f24] border border-gray-800 text-gray-400 hover:text-white hover:border-gray-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">{slider.name}</h1>
            <p className="text-gray-400 text-sm mt-1">
              Sección: {slider.section} · {slider.items.length}{" "}
              {slider.items.length === 1 ? "item" : "items"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <SliderSettings slider={slider} />
          <AddItemDialog sliderId={slider.id} />
        </div>
      </div>

      {/* Status indicator */}
      <div
        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
          slider.isActive
            ? "bg-green-500/10 text-green-400 border border-green-500/20"
            : "bg-gray-500/10 text-gray-400 border border-gray-500/20"
        }`}
      >
        <span
          className={`w-2 h-2 rounded-full ${slider.isActive ? "bg-green-400" : "bg-gray-400"}`}
        />
        {slider.isActive ? "Activo" : "Inactivo"}
      </div>

      {/* Items list with drag & drop */}
      <SliderItemsList items={slider.items} sliderId={slider.id} />

      {/* Help info */}
      {slider.items.length > 0 && (
        <div className="bg-[#1c1f24] border border-gray-800 rounded-xl p-4">
          <p className="text-gray-400 text-sm">
            <span className="text-white font-medium">Tip:</span> Arrastra los
            items para reordenarlos. Los cambios se guardan automáticamente.
          </p>
        </div>
      )}
    </div>
  );
}
