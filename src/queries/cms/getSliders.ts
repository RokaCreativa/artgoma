// 🧭 MIGA DE PAN: Queries de Sliders para CMS
// 📍 UBICACIÓN: src/queries/cms/getSliders.ts
//
// 🎯 PORQUÉ EXISTE: Proveer queries con cache para obtener sliders desde el frontend
// 🎯 CASOS DE USO: Carousel de videos, artistas, brands, live images
//
// 🔄 FLUJO: Frontend component → getSliderBySection() → Prisma → PostgreSQL
// 🔗 USADO EN: Carousel2.tsx, ArtistsCarousel.tsx, LogoCarousel, etc.
// ⚠️ DEPENDENCIAS: @/lib/db (Prisma), next/cache
//
// 🚨 CUIDADO: Cache de 60 segundos - cambios en admin tardan hasta 1 min en reflejarse
// 📋 SPEC: SPEC-26-01-2026-CMS-ContentManager (Tarea 1.8)

import { unstable_cache } from "next/cache";
import prisma from "@/lib/db";

// ============================================
// TIPOS
// ============================================

export interface ISliderItem {
  id: number;
  sliderId: number;
  type: string; // "youtube" | "image" | "video_url"
  url: string | null;
  youtubeId: string | null;
  title: string | null;
  alt: string | null;
  artistName: string | null;
  width: number | null;
  height: number | null;
  position: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISlider {
  id: number;
  name: string;
  slug: string;
  section: string;
  description: string | null;
  isActive: boolean;
  position: number;
  createdAt: Date;
  updatedAt: Date;
  items: ISliderItem[];
}

export interface ISliderWithoutItems {
  id: number;
  name: string;
  slug: string;
  section: string;
  description: string | null;
  isActive: boolean;
  position: number;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// QUERIES CON CACHE
// ============================================

/**
 * Obtiene un slider por sección con sus items activos ordenados por posición
 * @param section - Sección del slider: "hero", "stories", "artists", "brands", "live"
 * @returns Slider con items o null si no existe/no está activo
 *
 * @example
 * const storiesSlider = await getSliderBySection("stories");
 * // Devuelve: { id, name, items: [{ type: "youtube", youtubeId: "..." }, ...] }
 */
export const getSliderBySection = unstable_cache(
  async (section: string): Promise<ISlider | null> => {
    console.log(`[getSliderBySection] 🔍 Query para section="${section}"`);

    const slider = await prisma.slider.findFirst({
      where: {
        section,
        isActive: true,
      },
      include: {
        items: {
          where: {
            isActive: true,
          },
          orderBy: {
            position: "asc",
          },
        },
      },
    });

    console.log(`[getSliderBySection] ${slider ? '✅ ENCONTRADO' : '❌ NULL'} section="${section}"`, slider ? {
      name: slider.name,
      itemsCount: slider.items.length,
      items: slider.items.map(i => ({ id: i.id, type: i.type, isActive: i.isActive }))
    } : 'No existe slider activo');

    return slider;
  },
  ["slider-by-section"],
  {
    revalidate: 60, // 1 minuto
    tags: ["sliders"],
  }
);

/**
 * Obtiene un slider por slug con sus items activos
 * @param slug - Slug único del slider: "videos-stories", "artists-carousel", etc.
 * @returns Slider con items o null si no existe
 *
 * @example
 * const slider = await getSliderBySlug("videos-stories");
 */
export const getSliderBySlug = unstable_cache(
  async (slug: string): Promise<ISlider | null> => {
    const slider = await prisma.slider.findUnique({
      where: {
        slug,
        isActive: true,
      },
      include: {
        items: {
          where: {
            isActive: true,
          },
          orderBy: {
            position: "asc",
          },
        },
      },
    });

    return slider;
  },
  ["slider-by-slug"],
  {
    revalidate: 60,
    tags: ["sliders"],
  }
);

/**
 * Obtiene todos los sliders activos (sin items, para listados)
 * @returns Array de sliders ordenados por posición
 */
export const getAllSliders = unstable_cache(
  async (): Promise<ISliderWithoutItems[]> => {
    const sliders = await prisma.slider.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        position: "asc",
      },
    });

    return sliders;
  },
  ["all-sliders"],
  {
    revalidate: 60,
    tags: ["sliders"],
  }
);

/**
 * Obtiene un slider por ID con todos sus items (activos e inactivos)
 * Para uso en el admin principalmente
 * @param id - ID del slider
 * @returns Slider completo o null
 */
export const getSliderById = unstable_cache(
  async (id: number): Promise<ISlider | null> => {
    const slider = await prisma.slider.findUnique({
      where: { id },
      include: {
        items: {
          orderBy: {
            position: "asc",
          },
        },
      },
    });

    return slider;
  },
  ["slider-by-id"],
  {
    revalidate: 60,
    tags: ["sliders"],
  }
);

// ============================================
// VERSIONES SIN CACHE (para admin/server actions)
// ============================================

/**
 * Versión sin cache de getSliderBySection
 * Usar en server actions después de mutaciones
 */
export async function getSliderBySectionNoCache(section: string): Promise<ISlider | null> {
  const slider = await prisma.slider.findFirst({
    where: {
      section,
      isActive: true,
    },
    include: {
      items: {
        where: {
          isActive: true,
        },
        orderBy: {
          position: "asc",
        },
      },
    },
  });

  return slider;
}

/**
 * Versión sin cache de getSliderBySlug
 */
export async function getSliderBySlugNoCache(slug: string): Promise<ISlider | null> {
  const slider = await prisma.slider.findUnique({
    where: {
      slug,
      isActive: true,
    },
    include: {
      items: {
        where: {
          isActive: true,
        },
        orderBy: {
          position: "asc",
        },
      },
    },
  });

  return slider;
}
