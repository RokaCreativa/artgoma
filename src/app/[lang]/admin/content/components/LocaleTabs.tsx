// 🧭 MIGA DE PAN: LocaleTabs - Tabs para seleccionar idioma en el editor de contenido
// 📍 UBICACIÓN: src/app/[lang]/admin/content/components/LocaleTabs.tsx
// 🎯 PORQUÉ EXISTE: Permitir cambiar entre idiomas al editar una sección
// 🔄 FLUJO: Click en tab → Callback onLocaleChange → Padre carga contenido del idioma
// 🚨 CUIDADO: Indicador visual de "falta traducción" basado en existingLocales
// 📋 SPEC: SPEC-26-01-2026-CMS-ContentManager

"use client";

import { cn } from "@/lib/utils";
import { Check, AlertCircle, Sparkles, Loader2 } from "lucide-react";
import { LOCALE_LABELS } from "@/lib/cms/sectionSchemas";

interface LocaleTabsProps {
  locales: string[];
  activeLocale: string;
  existingLocales: string[];
  onLocaleChange: (locale: string) => void;
  disabled?: boolean;
  // Auto-translate props
  onAutoTranslate?: (targetLocale: string) => void;
  isTranslating?: boolean;
  translatingLocale?: string | null;
}

export default function LocaleTabs({
  locales,
  activeLocale,
  existingLocales,
  onLocaleChange,
  disabled = false,
  onAutoTranslate,
  isTranslating = false,
  translatingLocale = null,
}: LocaleTabsProps) {
  // Check if Spanish (source) has content for auto-translate to work
  const spanishHasContent = existingLocales.includes("es");

  return (
    <div className="flex flex-wrap gap-2">
      {locales.map((locale) => {
        const isActive = locale === activeLocale;
        const hasContent = existingLocales.includes(locale);
        const label = LOCALE_LABELS[locale as keyof typeof LOCALE_LABELS] || locale.toUpperCase();
        const isCurrentlyTranslating = isTranslating && translatingLocale === locale;

        // Show auto-translate button only for non-Spanish locales when Spanish has content
        const showAutoTranslate = locale !== "es" && spanishHasContent && onAutoTranslate;

        return (
          <div key={locale} className="flex items-center gap-1">
            <button
              onClick={() => onLocaleChange(locale)}
              disabled={disabled || isTranslating}
              className={cn(
                "relative flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all",
                "border-2",
                isActive
                  ? "bg-red-600 border-red-600 text-white"
                  : hasContent
                    ? "bg-[#2a2d35] border-[#374151] text-white hover:border-red-500/50"
                    : "bg-[#1c1f24] border-dashed border-[#374151] text-gray-400 hover:border-yellow-500/50 hover:text-gray-300",
                (disabled || isTranslating) && "opacity-50 cursor-not-allowed"
              )}
            >
              {/* Locale code */}
              <span className="uppercase font-bold">{locale}</span>

              {/* Divider */}
              <span className={cn(
                "w-px h-4",
                isActive ? "bg-white/30" : "bg-gray-600"
              )} />

              {/* Locale name */}
              <span className="font-normal">{label}</span>

              {/* Status indicator */}
              <span className={cn(
                "ml-1 flex items-center justify-center w-5 h-5 rounded-full",
                hasContent
                  ? isActive
                    ? "bg-white/20"
                    : "bg-green-500/20"
                  : "bg-yellow-500/20"
              )}>
                {isCurrentlyTranslating ? (
                  <Loader2 className="w-3 h-3 text-purple-400 animate-spin" />
                ) : hasContent ? (
                  <Check className={cn(
                    "w-3 h-3",
                    isActive ? "text-white" : "text-green-400"
                  )} />
                ) : (
                  <AlertCircle className="w-3 h-3 text-yellow-400" />
                )}
              </span>
            </button>

            {/* Auto-translate button */}
            {showAutoTranslate && (
              <button
                onClick={() => onAutoTranslate(locale)}
                disabled={disabled || isTranslating}
                title={`Auto-traducir desde ES a ${label}`}
                className={cn(
                  "flex items-center gap-1 px-2 py-2.5 rounded-lg text-xs transition-all",
                  "bg-purple-600/20 border border-purple-500/30 text-purple-300",
                  "hover:bg-purple-600/30 hover:border-purple-500/50 hover:text-purple-200",
                  (disabled || isTranslating) && "opacity-50 cursor-not-allowed"
                )}
              >
                {isCurrentlyTranslating ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5" />
                )}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
