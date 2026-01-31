// 🧭 MIGA DE PAN: ContentEditorClient - Componente cliente principal del editor de contenido
// 📍 UBICACIÓN: src/app/[lang]/admin/content/components/ContentEditorClient.tsx
// 🎯 PORQUÉ EXISTE: Orquestar selector de sección, tabs de idioma y editor
// 🔄 FLUJO: Seleccionar sección → Seleccionar idioma → Editar en SectionEditor
// 🚨 CUIDADO: Mantiene estado de sección/locale seleccionados
// 📋 SPEC: SPEC-26-01-2026-CMS-ContentManager

"use client";

import { useState, useCallback } from "react";
import { FileText, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { autoTranslateSectionContent } from "@/actions/cms/content";
import LocaleTabs from "./LocaleTabs";
import SectionEditor from "./SectionEditor";

interface Section {
  key: string;
  label: string;
  description: string;
  fields: ReadonlyArray<{
    readonly name: string;
    readonly type: "text" | "textarea" | "array";
    readonly label: string;
    readonly placeholder: string;
  }>;
}

interface ContentEditorClientProps {
  lang: string;
  sections: Section[];
  locales: string[];
  existingContentMap: Record<string, string[]>;
}

export default function ContentEditorClient({
  lang,
  sections,
  locales,
  existingContentMap,
}: ContentEditorClientProps) {
  const [selectedSection, setSelectedSection] = useState<string>(
    sections[0]?.key || "",
  );
  const [selectedLocale, setSelectedLocale] = useState<string>(lang);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [localExistingMap, setLocalExistingMap] = useState(existingContentMap);

  // Auto-translate state
  const [isTranslating, setIsTranslating] = useState(false);
  const [translatingLocale, setTranslatingLocale] = useState<string | null>(null);
  const [editorKey, setEditorKey] = useState(0); // Force re-mount of SectionEditor

  const currentSection = sections.find((s) => s.key === selectedSection);
  const existingLocalesForSection = localExistingMap[selectedSection] || [];

  // Callback cuando se guarda exitosamente
  const handleSaveSuccess = useCallback(() => {
    // Actualizar el mapa local para reflejar que este locale ahora tiene contenido
    setLocalExistingMap((prev) => {
      const current = prev[selectedSection] || [];
      if (!current.includes(selectedLocale)) {
        return {
          ...prev,
          [selectedSection]: [...current, selectedLocale],
        };
      }
      return prev;
    });
  }, [selectedSection, selectedLocale]);

  // Auto-translate handler
  const handleAutoTranslate = useCallback(async (targetLocale: string) => {
    // Confirm before translating
    const confirmed = window.confirm(
      `¿Auto-traducir la sección "${selectedSection}" desde Español a ${targetLocale.toUpperCase()}?\n\n` +
      `Solo se traducirán los campos vacíos. Los campos existentes se preservarán.`
    );

    if (!confirmed) return;

    setIsTranslating(true);
    setTranslatingLocale(targetLocale);

    try {
      const result = await autoTranslateSectionContent(
        selectedSection,
        "es", // Source: Spanish
        targetLocale
      );

      if (result.success && result.data) {
        const { fieldsTranslated, totalFields, cost } = result.data;

        // Update existing map to reflect new content
        setLocalExistingMap((prev) => {
          const current = prev[selectedSection] || [];
          if (!current.includes(targetLocale)) {
            return {
              ...prev,
              [selectedSection]: [...current, targetLocale],
            };
          }
          return prev;
        });

        // Show success toast
        toast({
          title: "Traduccion completada",
          description: `${fieldsTranslated} de ${totalFields} campos traducidos. Costo: ${cost}`,
        });

        // If user is viewing the translated locale, force reload the editor
        if (selectedLocale === targetLocale) {
          setEditorKey((prev) => prev + 1);
        }
      } else {
        toast({
          title: "Error al traducir",
          description: result.error || "Error desconocido",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Auto-translate error:", error);
      toast({
        title: "Error de conexion",
        description: "No se pudo conectar con el servicio de traduccion",
        variant: "destructive",
      });
    } finally {
      setIsTranslating(false);
      setTranslatingLocale(null);
    }
  }, [selectedSection, selectedLocale]);

  return (
    <div className="space-y-6">
      {/* Section Selector */}
      <div className="bg-[#2a2d35] rounded-xl p-4">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          {/* Section Dropdown */}
          <div className="relative flex-1 max-w-md">
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Sección a editar
            </label>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className={cn(
                "w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg",
                "bg-[#1c1f24] border border-gray-700 text-white",
                "hover:border-gray-600 transition-colors",
                dropdownOpen && "border-red-500",
              )}
            >
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-red-500" />
                <div className="text-left">
                  <div className="font-medium">
                    {currentSection?.label || "Seleccionar sección"}
                  </div>
                  {currentSection && (
                    <div className="text-xs text-gray-500">
                      {currentSection.fields.length} campos
                    </div>
                  )}
                </div>
              </div>
              <ChevronDown
                className={cn(
                  "w-5 h-5 text-gray-400 transition-transform",
                  dropdownOpen && "rotate-180",
                )}
              />
            </button>

            {/* Dropdown menu */}
            {dropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setDropdownOpen(false)}
                />
                <div className="absolute top-full left-0 right-0 mt-2 z-20 bg-[#1c1f24] border border-gray-700 rounded-lg shadow-xl overflow-hidden">
                  {sections.map((section) => {
                    const localesWithContent =
                      localExistingMap[section.key] || [];
                    const isSelected = section.key === selectedSection;

                    return (
                      <button
                        key={section.key}
                        onClick={() => {
                          setSelectedSection(section.key);
                          setDropdownOpen(false);
                        }}
                        className={cn(
                          "w-full flex items-center justify-between px-4 py-3 text-left",
                          "hover:bg-[#2a2d35] transition-colors",
                          isSelected &&
                            "bg-red-600/10 border-l-2 border-red-500",
                        )}
                      >
                        <div>
                          <div
                            className={cn(
                              "font-medium",
                              isSelected ? "text-red-400" : "text-white",
                            )}
                          >
                            {section.label}
                          </div>
                          <div className="text-xs text-gray-500">
                            {section.description}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">
                            {localesWithContent.length}/{locales.length} idiomas
                          </span>
                          {localesWithContent.length === locales.length && (
                            <span className="w-2 h-2 bg-green-500 rounded-full" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* Quick stats */}
          <div className="flex items-center gap-6 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                {sections.length}
              </div>
              <div className="text-gray-500">Secciones</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                {locales.length}
              </div>
              <div className="text-gray-500">Idiomas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {existingLocalesForSection.length}
              </div>
              <div className="text-gray-500">Traducidos</div>
            </div>
          </div>
        </div>
      </div>

      {/* Locale Tabs */}
      <div className="bg-[#2a2d35] rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-gray-400">
            Idioma
          </label>
          {existingLocalesForSection.includes("es") && (
            <span className="text-xs text-purple-400">
              Pulsa el icono de estrella para auto-traducir desde ES
            </span>
          )}
        </div>
        <LocaleTabs
          locales={locales}
          activeLocale={selectedLocale}
          existingLocales={existingLocalesForSection}
          onLocaleChange={setSelectedLocale}
          onAutoTranslate={handleAutoTranslate}
          isTranslating={isTranslating}
          translatingLocale={translatingLocale}
        />
      </div>

      {/* Section Editor */}
      {currentSection && (
        <SectionEditor
          key={`${selectedSection}-${selectedLocale}-${editorKey}`}
          sectionKey={selectedSection}
          sectionLabel={currentSection.label}
          sectionDescription={currentSection.description}
          fields={currentSection.fields}
          locale={selectedLocale}
          existingLocales={existingLocalesForSection}
          allLocales={locales}
          onSaveSuccess={handleSaveSuccess}
        />
      )}
    </div>
  );
}
