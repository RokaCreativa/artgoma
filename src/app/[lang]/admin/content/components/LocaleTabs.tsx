// 🧭 MIGA DE PAN: LocaleTabs - Tabs para seleccionar idioma en el editor de contenido
// 📍 UBICACIÓN: src/app/[lang]/admin/content/components/LocaleTabs.tsx
// 🎯 PORQUÉ EXISTE: Permitir cambiar entre idiomas al editar una sección
// 🔄 FLUJO: Click en tab → Callback onLocaleChange → Padre carga contenido del idioma
// 🚨 CUIDADO: Indicador visual de "falta traducción" basado en existingLocales
// 📋 SPEC: SPEC-26-01-2026-CMS-ContentManager

"use client";

import { cn } from "@/lib/utils";
import { Check, AlertCircle } from "lucide-react";
import { LOCALE_LABELS } from "@/lib/cms/sectionSchemas";

interface LocaleTabsProps {
  locales: string[];
  activeLocale: string;
  existingLocales: string[];
  onLocaleChange: (locale: string) => void;
  disabled?: boolean;
}

export default function LocaleTabs({
  locales,
  activeLocale,
  existingLocales,
  onLocaleChange,
  disabled = false,
}: LocaleTabsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {locales.map((locale) => {
        const isActive = locale === activeLocale;
        const hasContent = existingLocales.includes(locale);
        const label = LOCALE_LABELS[locale as keyof typeof LOCALE_LABELS] || locale.toUpperCase();

        return (
          <button
            key={locale}
            onClick={() => onLocaleChange(locale)}
            disabled={disabled}
            className={cn(
              "relative flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all",
              "border-2",
              isActive
                ? "bg-red-600 border-red-600 text-white"
                : hasContent
                  ? "bg-[#2a2d35] border-[#374151] text-white hover:border-red-500/50"
                  : "bg-[#1c1f24] border-dashed border-[#374151] text-gray-400 hover:border-yellow-500/50 hover:text-gray-300",
              disabled && "opacity-50 cursor-not-allowed"
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
              {hasContent ? (
                <Check className={cn(
                  "w-3 h-3",
                  isActive ? "text-white" : "text-green-400"
                )} />
              ) : (
                <AlertCircle className="w-3 h-3 text-yellow-400" />
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}
