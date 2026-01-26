// 🧭 MIGA DE PAN: Content Editor Page - Editor de textos multiidioma del CMS
// 📍 UBICACIÓN: src/app/[lang]/admin/content/page.tsx
// 🎯 PORQUÉ EXISTE: Permitir editar textos de todas las secciones en todos los idiomas
// 🔄 FLUJO: Seleccionar sección → Seleccionar idioma → Editar → Guardar
// 🚨 CUIDADO: Cambios se reflejan en el frontend después de revalidación
// 📋 SPEC: SPEC-26-01-2026-CMS-ContentManager

import { Locale } from "@/configs/i18n.config";
import ContentEditorClient from "./components/ContentEditorClient";
import { getAllSections, getSectionContentAllLocales } from "@/actions/cms/content";
import { getEditableSectionsSerializable, AVAILABLE_LOCALES } from "@/lib/cms/sectionSchemas";

interface ContentPageProps {
  params: Promise<{ lang: Locale }>;
}

export default async function ContentPage({ params }: ContentPageProps) {
  const { lang } = await params;

  // Obtener todas las secciones con sus locales configurados
  const sectionsResult = await getAllSections();
  // Usar versión serializable (sin schemas Zod) para pasar a Client Component
  const editableSections = getEditableSectionsSerializable();

  // Crear mapa de contenido existente por sección
  const existingContentMap: Record<string, string[]> = {};

  if (sectionsResult.success && sectionsResult.data) {
    for (const section of sectionsResult.data) {
      existingContentMap[section.sectionKey] = section.locales;
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Editor de Contenido</h1>
          <p className="text-gray-400 mt-1">
            Edita los textos de cada sección en todos los idiomas
          </p>
        </div>
      </div>

      {/* Editor Client Component */}
      <ContentEditorClient
        lang={lang}
        sections={editableSections}
        locales={AVAILABLE_LOCALES as unknown as string[]}
        existingContentMap={existingContentMap}
      />
    </div>
  );
}
