// 🧭 MIGA DE PAN: Queries de Configuración del Sitio para CMS
// 📍 UBICACIÓN: src/queries/cms/getSiteConfig.ts
//
// 🎯 PORQUÉ EXISTE: Obtener configuración del sitio (contacto, redes, footer) desde BD
// 🎯 CASOS DE USO: Footer, GetInTouch, links de redes sociales, metadata
//
// 🔄 FLUJO: Component → getConfigByGroup("contact") → Prisma → Array de configs
// 🔗 USADO EN: Footer.tsx, GetInTouch.tsx, Head/metadata
// ⚠️ DEPENDENCIAS: @/lib/db (Prisma), next/cache
//
// 🚨 CUIDADO: Cache de 5 minutos - cambios en admin tardan en reflejarse
// 📋 SPEC: SPEC-26-01-2026-CMS-ContentManager (Tarea 1.8)

import { unstable_cache } from "next/cache";
import prisma from "@/lib/db";

// ============================================
// TIPOS
// ============================================

export interface ISiteConfig {
  id: number;
  key: string;
  value: string;
  type: string; // "text" | "url" | "email" | "phone" | "image"
  group: string; // "contact" | "social" | "footer" | "meta" | "general"
  label: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// Tipo para acceso rápido por key
export type ConfigMap = Record<string, string>;

// Grupos predefinidos
export type ConfigGroup = "contact" | "social" | "footer" | "meta" | "general";

// Keys conocidas para type-safety
export type ContactConfigKey = "phone" | "email" | "address" | "whatsapp";
export type SocialConfigKey = "facebook" | "instagram" | "youtube" | "twitter" | "linkedin" | "tiktok";
export type FooterConfigKey = "copyright" | "year" | "website" | "company_name";
export type MetaConfigKey = "site_title" | "site_description" | "og_image";

// ============================================
// QUERIES CON CACHE
// ============================================

/**
 * Obtiene todas las configuraciones de un grupo
 * @param group - Grupo de configuración: "contact", "social", "footer", "meta", "general"
 * @returns Array de configuraciones del grupo
 *
 * @example
 * const contactConfigs = await getConfigByGroup("contact");
 * // Devuelve: [{ key: "phone", value: "+34...", type: "phone" }, ...]
 */
export const getConfigByGroup = unstable_cache(
  async (group: ConfigGroup | string): Promise<ISiteConfig[]> => {
    const configs = await prisma.siteConfig.findMany({
      where: {
        group,
      },
      orderBy: {
        key: "asc",
      },
    });

    return configs;
  },
  ["config-by-group"],
  {
    revalidate: 300, // 5 minutos
    tags: ["site-config"],
  }
);

/**
 * Obtiene una configuración específica por su key
 * @param key - Clave de configuración: "phone", "email", "facebook", etc.
 * @returns Valor de la configuración o null si no existe
 *
 * @example
 * const phone = await getConfigByKey("phone");
 * // Devuelve: "+34 123 456 789"
 */
export const getConfigByKey = unstable_cache(
  async (key: string): Promise<string | null> => {
    const config = await prisma.siteConfig.findUnique({
      where: {
        key,
      },
    });

    return config?.value ?? null;
  },
  ["config-by-key"],
  {
    revalidate: 300,
    tags: ["site-config"],
  }
);

/**
 * Obtiene múltiples configuraciones por sus keys
 * @param keys - Array de claves
 * @returns Objeto con key como clave y value como valor
 *
 * @example
 * const configs = await getConfigsByKeys(["phone", "email", "address"]);
 * // Devuelve: { phone: "+34...", email: "info@...", address: "..." }
 */
export const getConfigsByKeys = unstable_cache(
  async (keys: string[]): Promise<ConfigMap> => {
    const configs = await prisma.siteConfig.findMany({
      where: {
        key: {
          in: keys,
        },
      },
    });

    const result: ConfigMap = {};
    for (const config of configs) {
      result[config.key] = config.value;
    }

    return result;
  },
  ["configs-by-keys"],
  {
    revalidate: 300,
    tags: ["site-config"],
  }
);

/**
 * Obtiene todas las configuraciones de un grupo como mapa key-value
 * Más conveniente para usar en componentes
 *
 * @param group - Grupo de configuración
 * @returns Objeto con key como clave y value como valor
 *
 * @example
 * const social = await getConfigMapByGroup("social");
 * // Devuelve: { facebook: "https://...", instagram: "https://...", ... }
 */
export const getConfigMapByGroup = unstable_cache(
  async (group: ConfigGroup | string): Promise<ConfigMap> => {
    const configs = await prisma.siteConfig.findMany({
      where: {
        group,
      },
    });

    const result: ConfigMap = {};
    for (const config of configs) {
      result[config.key] = config.value;
    }

    return result;
  },
  ["config-map-by-group"],
  {
    revalidate: 300,
    tags: ["site-config"],
  }
);

/**
 * Obtiene todas las configuraciones del sitio
 * Útil para el admin o para pre-cargar todo
 *
 * @returns Array de todas las configuraciones
 */
export const getAllConfigs = unstable_cache(
  async (): Promise<ISiteConfig[]> => {
    const configs = await prisma.siteConfig.findMany({
      orderBy: [
        { group: "asc" },
        { key: "asc" },
      ],
    });

    return configs;
  },
  ["all-configs"],
  {
    revalidate: 300,
    tags: ["site-config"],
  }
);

/**
 * Obtiene todas las configuraciones agrupadas
 * @returns Objeto con grupo como clave y array de configs como valor
 *
 * @example
 * const grouped = await getAllConfigsGrouped();
 * // Devuelve: { contact: [...], social: [...], footer: [...] }
 */
export const getAllConfigsGrouped = unstable_cache(
  async (): Promise<Record<string, ISiteConfig[]>> => {
    const configs = await prisma.siteConfig.findMany({
      orderBy: {
        key: "asc",
      },
    });

    const result: Record<string, ISiteConfig[]> = {};

    for (const config of configs) {
      if (!result[config.group]) {
        result[config.group] = [];
      }
      result[config.group].push(config);
    }

    return result;
  },
  ["all-configs-grouped"],
  {
    revalidate: 300,
    tags: ["site-config"],
  }
);

// ============================================
// HELPERS ESPECÍFICOS (para uso común)
// ============================================

/**
 * Obtiene información de contacto (phone, email, address)
 * Helper de conveniencia para GetInTouch y Footer
 */
export const getContactInfo = unstable_cache(
  async (): Promise<{
    phone: string | null;
    email: string | null;
    address: string | null;
    whatsapp: string | null;
  }> => {
    const configs = await prisma.siteConfig.findMany({
      where: {
        group: "contact",
      },
    });

    const map: Record<string, string> = {};
    for (const config of configs) {
      map[config.key] = config.value;
    }

    return {
      phone: map.phone ?? null,
      email: map.email ?? null,
      address: map.address ?? null,
      whatsapp: map.whatsapp ?? null,
    };
  },
  ["contact-info"],
  {
    revalidate: 300,
    tags: ["site-config"],
  }
);

/**
 * Obtiene links de redes sociales
 * Helper de conveniencia para Footer
 */
export const getSocialLinks = unstable_cache(
  async (): Promise<{
    facebook: string | null;
    instagram: string | null;
    youtube: string | null;
    twitter: string | null;
    linkedin: string | null;
    tiktok: string | null;
  }> => {
    const configs = await prisma.siteConfig.findMany({
      where: {
        group: "social",
      },
    });

    const map: Record<string, string> = {};
    for (const config of configs) {
      map[config.key] = config.value;
    }

    return {
      facebook: map.facebook ?? null,
      instagram: map.instagram ?? null,
      youtube: map.youtube ?? null,
      twitter: map.twitter ?? null,
      linkedin: map.linkedin ?? null,
      tiktok: map.tiktok ?? null,
    };
  },
  ["social-links"],
  {
    revalidate: 300,
    tags: ["site-config"],
  }
);

// ============================================
// VERSIONES SIN CACHE (para admin/server actions)
// ============================================

/**
 * Versión sin cache de getConfigByKey
 */
export async function getConfigByKeyNoCache(key: string): Promise<string | null> {
  const config = await prisma.siteConfig.findUnique({
    where: { key },
  });

  return config?.value ?? null;
}

/**
 * Versión sin cache de getConfigByGroup
 */
export async function getConfigByGroupNoCache(group: string): Promise<ISiteConfig[]> {
  const configs = await prisma.siteConfig.findMany({
    where: { group },
    orderBy: { key: "asc" },
  });

  return configs;
}

/**
 * Obtiene una config completa (con metadata) - útil para edición
 */
export async function getConfigFullNoCache(key: string): Promise<ISiteConfig | null> {
  const config = await prisma.siteConfig.findUnique({
    where: { key },
  });

  return config;
}
