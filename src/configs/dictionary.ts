// 🧭 MIGA DE PAN: dictionary.ts - Sistema de Contenido Multiidioma
// 📍 UBICACIÓN: src/configs/dictionary.ts
//
// 🎯 PORQUÉ EXISTE: Proveer textos traducidos a toda la aplicación
// 🎯 CASOS DE USO: Server components, DictionaryProvider, useDictionary hook
//
// 🔄 FLUJO: Component → getDictionary(lang) → BD (cache 300s) → Fallback JSON
// 🔗 USADO EN: layout.tsx, Hero, Connect, Inspire, GetInTouch, Navbar, etc.
// ⚠️ DEPENDENCIAS: prisma, next/cache, dictionaries/*.json
//
// 🚨 CUIDADO: Si BD falla, cae a JSON silenciosamente (resiliente)
// 📋 SPEC: SPEC-26-01-2026-CMS-ContentManager (Fase 2.4)

import "server-only";
import { unstable_cache } from "next/cache";
import type { Locale } from "@/configs/i18n.config";
import prisma from "@/lib/db";

// ============================================
// IMPORTACIÓN DE JSON (FALLBACK)
// ============================================

const jsonDictionaries = {
  en: () => import("../../dictionaries/en.json").then((r) => r.default),
  es: () => import("../../dictionaries/es.json").then((r) => r.default),
  de: () => import("../../dictionaries/de.json").then((r) => r.default),
  fr: () => import("../../dictionaries/fr.json").then((r) => r.default),
  it: () => import("../../dictionaries/it.json").then((r) => r.default),
  ru: () => import("../../dictionaries/ru.json").then((r) => r.default),
};

// Tipo inferido del diccionario JSON
export type Dictionary = Awaited<ReturnType<typeof jsonDictionaries.en>>;

// Secciones que buscamos en BD (mapean 1:1 con keys del JSON)
const SECTION_KEYS = [
  "home",
  "enjoy",
  "connect",
  "inspire",
  "contact",
  "getInTouch",
  "welcomePage",
  "navbar",
  "dropdown",
  "form",
  "ui",
] as const;

// ============================================
// FUNCIÓN PRINCIPAL: getDictionary
// ============================================

/**
 * Obtiene el diccionario completo para un idioma.
 *
 * FLUJO:
 * 1. Intenta obtener contenido de BD (SectionContent) con cache 300s
 * 2. Si BD tiene contenido, lo usa
 * 3. Si BD está vacía o falla, cae al JSON estático
 *
 * @param locale - Código de idioma: "es", "en", "de", "fr", "it", "ru"
 * @returns Diccionario completo con todas las secciones
 *
 * @example
 * const dict = await getDictionary("es");
 * console.log(dict.home.h1); // "EXPERIENCIA ÚNICA"
 */
export const getDictionary = async (locale: Locale): Promise<Dictionary> => {
  // Primero intentamos obtener desde BD con cache
  const dbContent = await getDictionaryFromDB(locale);

  // DEBUG: Ver que viene de BD
  if (process.env.NODE_ENV === "development") {
    const dbKeys = dbContent ? Object.keys(dbContent) : [];
    console.log(`[getDictionary] locale=${locale}, DB sections=${dbKeys.length}:`, dbKeys.join(", ") || "(empty)");
  }

  // Si tenemos contenido de BD, lo usamos
  if (dbContent && Object.keys(dbContent).length > 0) {
    // Obtenemos el JSON como fallback para secciones que no estén en BD
    const jsonFallback = await getJsonDictionary(locale);

    // Merge: BD tiene prioridad, JSON llena los huecos
    return mergeDictionaries(dbContent, jsonFallback);
  }

  // Fallback completo a JSON si BD vacía o falla
  if (process.env.NODE_ENV === "development") {
    console.log(`[getDictionary] Using JSON fallback for locale=${locale}`);
  }
  return getJsonDictionary(locale);
};

// ============================================
// HELPER: Obtener JSON (fallback)
// ============================================

async function getJsonDictionary(locale: Locale): Promise<Dictionary> {
  try {
    const loader = jsonDictionaries[locale] ?? jsonDictionaries.en;
    return await loader();
  } catch {
    // Si falla el JSON del idioma, intentamos con inglés
    return jsonDictionaries.en();
  }
}

// ============================================
// HELPER: Obtener de BD con cache
// ============================================

const getDictionaryFromDB = unstable_cache(
  async (locale: string): Promise<Partial<Dictionary> | null> => {
    try {
      // Verificar si el modelo existe
      if (!prisma.sectionContent) {
        if (process.env.NODE_ENV === "development") {
          console.log("[getDictionaryFromDB] prisma.sectionContent not available");
        }
        return null;
      }

      // Query todas las secciones activas para este idioma
      const sections = await prisma.sectionContent.findMany({
        where: {
          locale,
          isActive: true,
          sectionKey: {
            in: [...SECTION_KEYS],
          },
        },
        select: {
          sectionKey: true,
          content: true,
        },
      });

      // DEBUG: Log query result
      if (process.env.NODE_ENV === "development") {
        console.log(`[getDictionaryFromDB] locale=${locale}, found ${sections.length} active sections`);
      }

      // Si no hay nada en BD, retornamos null para usar JSON
      if (!sections || sections.length === 0) {
        return null;
      }

      // Construir objeto con la estructura del diccionario
      const result: Record<string, unknown> = {};

      for (const section of sections) {
        result[section.sectionKey] = section.content;
      }

      return result as Partial<Dictionary>;
    } catch (error) {
      // Si hay error de BD (ej: tabla no existe aún), silenciosamente usar fallback JSON
      if (process.env.NODE_ENV === "development") {
        console.warn("[getDictionaryFromDB] BD query failed:", error);
      }
      return null;
    }
  },
  ["dictionary-from-db"],
  {
    revalidate: 300, // 5 minutos de cache
    tags: ["cms-content", "dictionary"],
  },
);

// ============================================
// HELPER: Merge dictionaries (BD + JSON fallback)
// ============================================

function mergeDictionaries(
  dbContent: Partial<Dictionary>,
  jsonFallback: Dictionary,
): Dictionary {
  // Empezamos con el JSON como base
  const merged = { ...jsonFallback };

  // Sobreescribimos con contenido de BD donde exista
  for (const key of SECTION_KEYS) {
    const dbValue = dbContent[key as keyof typeof dbContent];
    if (dbValue !== undefined) {
      (merged as Record<string, unknown>)[key] = dbValue;
    }
  }

  return merged;
}

// ============================================
// EXPORT LEGACY (compatibilidad)
// ============================================

// Mantener export de dictionaries para código que lo use directamente
export const dictionaries = jsonDictionaries;
