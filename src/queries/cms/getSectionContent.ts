// 🧭 MIGA DE PAN: Queries de Contenido de Secciones para CMS
// 📍 UBICACIÓN: src/queries/cms/getSectionContent.ts
//
// 🎯 PORQUÉ EXISTE: Obtener textos multiidioma de secciones desde BD
// 🎯 CASOS DE USO: Hero, Connect, Inspire, Location, GetInTouch, WelcomePage
//
// 🔄 FLUJO: Page/Component → getSectionContent(key, locale) → Prisma → JSON content
// 🔗 USADO EN: Todas las secciones que muestran textos traducidos
// ⚠️ DEPENDENCIAS: @/lib/db (Prisma), next/cache
//
// 🚨 CUIDADO: Fallback a "es" si no existe el locale solicitado
// 📋 SPEC: SPEC-26-01-2026-CMS-ContentManager (Tarea 1.8)

import { unstable_cache } from "next/cache";
import prisma from "@/lib/db";
import type { Prisma } from "@prisma/client";

// ============================================
// TIPOS
// ============================================

export interface ISectionContent {
  id: number;
  sectionKey: string;
  locale: string;
  content: Prisma.JsonValue; // JSON flexible según sección
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Tipos específicos por sección (para type-safety en componentes)
export interface HeroContent {
  h1?: string;
  button?: string;
}

export interface ConnectContent {
  h1?: {
    span1?: string;
    span2?: string;
  };
}

export interface InspireContent {
  h1?: string;
  text?: {
    p1?: string;
    p2?: string;
    p3?: string;
    p4?: string;
  };
  caption?: string;
}

export interface LocationContent {
  h1?: string;
}

export interface GetInTouchContent {
  h1?: string;
  contact?: string;
}

export interface WelcomePageContent {
  h1?: string;
  h2?: string;
  h3?: string;
  description?: string;
  buttons?: {
    primary?: string;
    secondary?: string;
  };
}

// Union type para todos los posibles contenidos
export type SectionContentData =
  | HeroContent
  | ConnectContent
  | InspireContent
  | LocationContent
  | GetInTouchContent
  | WelcomePageContent
  | Record<string, unknown>;

// ============================================
// QUERIES CON CACHE
// ============================================

/**
 * Obtiene el contenido de una sección para un idioma específico
 * Si no existe el idioma, intenta con "es" como fallback
 *
 * @param sectionKey - Clave de sección: "hero", "connect", "inspire", "location", "getInTouch", "welcomePage"
 * @param locale - Código de idioma: "es", "en", "de", "fr", "it", "ru"
 * @returns Contenido JSON de la sección o null si no existe
 *
 * @example
 * const heroContent = await getSectionContent("hero", "en");
 * // Devuelve: { h1: "UNIQUE EXPERIENCE", button: "DISCOVER" }
 */
export const getSectionContent = unstable_cache(
  async (
    sectionKey: string,
    locale: string,
  ): Promise<SectionContentData | null> => {
    // Intentar obtener el contenido para el locale solicitado
    let sectionContent = await prisma.sectionContent.findUnique({
      where: {
        sectionKey_locale: {
          sectionKey,
          locale,
        },
        isActive: true,
      },
    });

    // Fallback a español si no existe el locale solicitado
    if (!sectionContent && locale !== "es") {
      sectionContent = await prisma.sectionContent.findUnique({
        where: {
          sectionKey_locale: {
            sectionKey,
            locale: "es",
          },
          isActive: true,
        },
      });
    }

    if (!sectionContent) {
      return null;
    }

    // El content es JSON, lo devolvemos tipado
    return sectionContent.content as SectionContentData;
  },
  ["section-content"],
  {
    revalidate: 300, // 5 minutos
    tags: ["section-content"],
  },
);

/**
 * Obtiene el contenido completo de una sección (todos los idiomas)
 * Útil para el admin o para pre-cargar traducciones
 *
 * @param sectionKey - Clave de sección
 * @returns Array de contenidos por idioma
 */
export const getSectionContentAllLocales = unstable_cache(
  async (sectionKey: string): Promise<ISectionContent[]> => {
    const contents = await prisma.sectionContent.findMany({
      where: {
        sectionKey,
        isActive: true,
      },
      orderBy: {
        locale: "asc",
      },
    });

    return contents;
  },
  ["section-content-all-locales"],
  {
    revalidate: 300,
    tags: ["section-content"],
  },
);

/**
 * Obtiene todas las secciones disponibles (para listar en admin)
 * @returns Array de sectionKeys únicos
 */
export const getAllSectionKeys = unstable_cache(
  async (): Promise<string[]> => {
    const sections = await prisma.sectionContent.findMany({
      where: {
        isActive: true,
      },
      select: {
        sectionKey: true,
      },
      distinct: ["sectionKey"],
    });

    return sections.map((s) => s.sectionKey);
  },
  ["all-section-keys"],
  {
    revalidate: 300,
    tags: ["section-content"],
  },
);

/**
 * Obtiene múltiples secciones de una vez para un locale
 * Optimización para cargar toda la página de una vez
 *
 * @param sectionKeys - Array de claves de sección
 * @param locale - Código de idioma
 * @returns Objeto con sectionKey como clave y contenido como valor
 *
 * @example
 * const content = await getMultipleSections(["hero", "connect", "inspire"], "en");
 * // Devuelve: { hero: {...}, connect: {...}, inspire: {...} }
 */
export const getMultipleSections = unstable_cache(
  async (
    sectionKeys: string[],
    locale: string,
  ): Promise<Record<string, SectionContentData>> => {
    const contents = await prisma.sectionContent.findMany({
      where: {
        sectionKey: {
          in: sectionKeys,
        },
        locale,
        isActive: true,
      },
    });

    // Crear mapa de resultados
    const result: Record<string, SectionContentData> = {};

    for (const content of contents) {
      result[content.sectionKey] = content.content as SectionContentData;
    }

    // Para las secciones que no se encontraron, intentar fallback a español
    const missingKeys = sectionKeys.filter((key) => !result[key]);

    if (missingKeys.length > 0 && locale !== "es") {
      const fallbackContents = await prisma.sectionContent.findMany({
        where: {
          sectionKey: {
            in: missingKeys,
          },
          locale: "es",
          isActive: true,
        },
      });

      for (const content of fallbackContents) {
        result[content.sectionKey] = content.content as SectionContentData;
      }
    }

    return result;
  },
  ["multiple-sections"],
  {
    revalidate: 300,
    tags: ["section-content"],
  },
);

// ============================================
// VERSIONES SIN CACHE (para admin/server actions)
// ============================================

/**
 * Versión sin cache de getSectionContent
 * Usar en server actions después de mutaciones
 */
export async function getSectionContentNoCache(
  sectionKey: string,
  locale: string,
): Promise<SectionContentData | null> {
  let sectionContent = await prisma.sectionContent.findUnique({
    where: {
      sectionKey_locale: {
        sectionKey,
        locale,
      },
      isActive: true,
    },
  });

  if (!sectionContent && locale !== "es") {
    sectionContent = await prisma.sectionContent.findUnique({
      where: {
        sectionKey_locale: {
          sectionKey,
          locale: "es",
        },
        isActive: true,
      },
    });
  }

  return sectionContent ? (sectionContent.content as SectionContentData) : null;
}

/**
 * Obtiene el registro completo (con metadata) - útil para edición
 */
export async function getSectionContentFullNoCache(
  sectionKey: string,
  locale: string,
): Promise<ISectionContent | null> {
  const sectionContent = await prisma.sectionContent.findUnique({
    where: {
      sectionKey_locale: {
        sectionKey,
        locale,
      },
    },
  });

  return sectionContent;
}
