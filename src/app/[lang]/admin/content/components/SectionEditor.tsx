// 🧭 MIGA DE PAN: SectionEditor - Formulario dinámico para editar contenido de secciones
// 📍 UBICACIÓN: src/app/[lang]/admin/content/components/SectionEditor.tsx
// 🎯 PORQUÉ EXISTE: Renderizar campos según la estructura de cada sección y guardar cambios
// 🔄 FLUJO: Cargar datos → Editar campos → Guardar → Feedback visual
// 🚨 CUIDADO: Campos anidados usan notación punto (h1.span1)
// 📋 SPEC: SPEC-26-01-2026-CMS-ContentManager

"use client";

import { useState, useEffect } from "react";
import { Save, Loader2, Check, AlertCircle, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getNestedValue,
  setNestedValue,
  LOCALE_LABELS,
  type Locale,
} from "@/lib/cms/sectionSchemas";
import {
  upsertSectionContent,
  getSectionContent,
  copySectionContentToLocale,
} from "@/actions/cms/content";

interface Field {
  readonly name: string;
  readonly type: "text" | "textarea" | "array";
  readonly label: string;
  readonly placeholder: string;
}

interface SectionEditorProps {
  sectionKey: string;
  sectionLabel: string;
  sectionDescription: string;
  fields: ReadonlyArray<Field>;
  locale: string;
  existingLocales: string[];
  allLocales: string[];
  onSaveSuccess?: () => void;
}

type SaveStatus = "idle" | "saving" | "success" | "error";

export default function SectionEditor({
  sectionKey,
  sectionLabel,
  sectionDescription,
  fields,
  locale,
  existingLocales,
  allLocales,
  onSaveSuccess,
}: SectionEditorProps) {
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [initialData, setInitialData] = useState<Record<string, unknown>>({});
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [copyingFrom, setCopyingFrom] = useState<string | null>(null);

  // Cargar datos existentes cuando cambia sección o locale
  useEffect(() => {
    async function loadContent() {
      setLoading(true);
      setSaveStatus("idle");
      setErrorMessage("");

      try {
        const result = await getSectionContent(sectionKey, locale);

        if (result.success && result.data?.content) {
          const content = result.data.content as Record<string, unknown>;
          setFormData(JSON.parse(JSON.stringify(content)));
          setInitialData(JSON.parse(JSON.stringify(content)));
        } else {
          // No hay contenido, inicializar vacío
          const emptyData: Record<string, unknown> = {};
          for (const field of fields) {
            if (field.type === "array") {
              setNestedValue(emptyData, field.name, []);
            } else {
              setNestedValue(emptyData, field.name, "");
            }
          }
          setFormData(emptyData);
          setInitialData({});
        }
      } catch (error) {
        console.error("Error loading content:", error);
        setErrorMessage("Error al cargar el contenido");
      } finally {
        setLoading(false);
      }
    }

    loadContent();
  }, [sectionKey, locale, fields]);

  // Manejar cambio en campos
  const handleFieldChange = (fieldName: string, value: string) => {
    setFormData((prev) => {
      const newData = JSON.parse(JSON.stringify(prev));
      setNestedValue(newData, fieldName, value);
      return newData;
    });
    // Reset status al editar
    if (saveStatus === "success" || saveStatus === "error") {
      setSaveStatus("idle");
    }
  };

  // Manejar cambio en arrays
  const handleArrayChange = (fieldName: string, value: string) => {
    // Separar por comas y limpiar espacios
    const arrayValue = value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    setFormData((prev) => {
      const newData = JSON.parse(JSON.stringify(prev));
      setNestedValue(newData, fieldName, arrayValue);
      return newData;
    });
    if (saveStatus === "success" || saveStatus === "error") {
      setSaveStatus("idle");
    }
  };

  // Guardar cambios
  const handleSave = async () => {
    setSaveStatus("saving");
    setErrorMessage("");

    try {
      const result = await upsertSectionContent(sectionKey, locale, formData);

      if (result.success) {
        setSaveStatus("success");
        setInitialData(JSON.parse(JSON.stringify(formData)));
        onSaveSuccess?.();

        // Reset status después de 3 segundos
        setTimeout(() => {
          setSaveStatus("idle");
        }, 3000);
      } else {
        setSaveStatus("error");
        setErrorMessage(result.error || "Error al guardar");
      }
    } catch (error) {
      console.error("Error saving content:", error);
      setSaveStatus("error");
      setErrorMessage("Error de conexión");
    }
  };

  // Copiar desde otro idioma
  const handleCopyFrom = async (fromLocale: string) => {
    if (copyingFrom) return;

    setCopyingFrom(fromLocale);
    setErrorMessage("");

    try {
      const result = await copySectionContentToLocale(
        sectionKey,
        fromLocale,
        locale,
      );

      if (result.success && result.data?.content) {
        const content = result.data.content as Record<string, unknown>;
        setFormData(JSON.parse(JSON.stringify(content)));
        setSaveStatus("success");
        onSaveSuccess?.();

        setTimeout(() => {
          setSaveStatus("idle");
        }, 3000);
      } else {
        setErrorMessage(result.error || "Error al copiar");
      }
    } catch (error) {
      console.error("Error copying content:", error);
      setErrorMessage("Error de conexión");
    } finally {
      setCopyingFrom(null);
    }
  };

  // Verificar si hay cambios sin guardar
  const hasChanges = JSON.stringify(formData) !== JSON.stringify(initialData);

  // Obtener locales disponibles para copiar (que tengan contenido)
  const copyableLocales = existingLocales.filter((l) => l !== locale);

  if (loading) {
    return (
      <div className="bg-[#2a2d35] rounded-xl p-8 flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-red-500 animate-spin" />
        <span className="ml-3 text-gray-400">Cargando contenido...</span>
      </div>
    );
  }

  return (
    <div className="bg-[#2a2d35] rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">{sectionLabel}</h2>
            <p className="text-gray-400 text-sm mt-1">{sectionDescription}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs px-2 py-1 bg-red-600/20 text-red-400 rounded">
                {locale.toUpperCase()}
              </span>
              <span className="text-xs text-gray-500">
                {LOCALE_LABELS[locale as Locale]}
              </span>
            </div>
          </div>

          {/* Copy from another locale */}
          {copyableLocales.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Copiar de:</span>
              {copyableLocales.map((l) => (
                <button
                  key={l}
                  onClick={() => handleCopyFrom(l)}
                  disabled={!!copyingFrom}
                  className={cn(
                    "flex items-center gap-1 px-2 py-1 text-xs rounded",
                    "bg-[#1c1f24] text-gray-400 hover:text-white hover:bg-[#374151]",
                    "transition-colors",
                    copyingFrom === l && "opacity-50",
                  )}
                >
                  {copyingFrom === l ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Form fields */}
      <div className="p-6 space-y-6">
        {fields.map((field) => {
          const value = getNestedValue(formData, field.name);
          const displayValue =
            field.type === "array"
              ? Array.isArray(value)
                ? value.join(", ")
                : ""
              : typeof value === "string"
                ? value
                : "";

          return (
            <div key={field.name} className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                {field.label}
                <span className="ml-2 text-xs text-gray-500 font-mono">
                  ({field.name})
                </span>
              </label>

              {field.type === "textarea" ? (
                <textarea
                  value={displayValue}
                  onChange={(e) =>
                    handleFieldChange(field.name, e.target.value)
                  }
                  placeholder={field.placeholder}
                  rows={4}
                  className={cn(
                    "w-full px-4 py-3 rounded-lg",
                    "bg-[#1c1f24] border border-gray-700",
                    "text-white placeholder-gray-500",
                    "focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500",
                    "transition-colors resize-y",
                  )}
                />
              ) : field.type === "array" ? (
                <div className="space-y-1">
                  <input
                    type="text"
                    value={displayValue}
                    onChange={(e) =>
                      handleArrayChange(field.name, e.target.value)
                    }
                    placeholder={field.placeholder}
                    className={cn(
                      "w-full px-4 py-3 rounded-lg",
                      "bg-[#1c1f24] border border-gray-700",
                      "text-white placeholder-gray-500",
                      "focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500",
                      "transition-colors",
                    )}
                  />
                  <p className="text-xs text-gray-500">
                    Separa los elementos con comas
                  </p>
                </div>
              ) : (
                <input
                  type="text"
                  value={displayValue}
                  onChange={(e) =>
                    handleFieldChange(field.name, e.target.value)
                  }
                  placeholder={field.placeholder}
                  className={cn(
                    "w-full px-4 py-3 rounded-lg",
                    "bg-[#1c1f24] border border-gray-700",
                    "text-white placeholder-gray-500",
                    "focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500",
                    "transition-colors",
                  )}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Footer with save button */}
      <div className="p-6 border-t border-gray-700 bg-[#1c1f24]/50">
        <div className="flex items-center justify-between">
          {/* Status messages */}
          <div className="flex items-center gap-2">
            {errorMessage && (
              <div className="flex items-center gap-2 text-red-400 text-sm">
                <AlertCircle className="w-4 h-4" />
                {errorMessage}
              </div>
            )}
            {saveStatus === "success" && !errorMessage && (
              <div className="flex items-center gap-2 text-green-400 text-sm">
                <Check className="w-4 h-4" />
                Guardado correctamente
              </div>
            )}
            {hasChanges && saveStatus === "idle" && (
              <div className="text-yellow-400 text-sm">
                Tienes cambios sin guardar
              </div>
            )}
          </div>

          {/* Save button */}
          <button
            onClick={handleSave}
            disabled={saveStatus === "saving" || !hasChanges}
            className={cn(
              "flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all",
              hasChanges
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-gray-700 text-gray-400 cursor-not-allowed",
            )}
          >
            {saveStatus === "saving" ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Guardando...
              </>
            ) : saveStatus === "success" ? (
              <>
                <Check className="w-4 h-4" />
                Guardado
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Guardar cambios
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
