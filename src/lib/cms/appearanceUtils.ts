// 🧭 MIGA DE PAN: Utilidades de Apariencia para CMS
// 📍 UBICACION: src/lib/cms/appearanceUtils.ts
//
// 🎯 PORQUE EXISTE: Cargar configuraciones de apariencia desde BD y generar CSS dinamico
// 🎯 CASOS DE USO: RootLayout para inyectar variables CSS, cargar fonts dinamicamente
//
// 🔄 FLUJO: layout.tsx → getAppearanceConfigs() → CSS variables → <style> tag
// 🔗 USADO EN: src/app/[lang]/layout.tsx
// ⚠️ DEPENDENCIAS: @/lib/db (Prisma), next/cache
//
// 🚨 CUIDADO: Cache de 5 minutos - cambios en admin tardan en reflejarse
// 📋 SPEC: SPEC-26-01-2026-CMS-ContentManager (Tarea 5.4)

import { unstable_cache } from "next/cache";
import prisma from "@/lib/db";

// ============================================
// TIPOS
// ============================================

export interface AppearanceConfig {
  bgPrimary: string;
  bgSurface: string;
  bgInput: string;
  accentColor: string;
  bgFooter: string;
  fontDisplay: string;
  fontBody: string;
}

// Valores por defecto (los actuales del proyecto hardcodeados)
export const DEFAULT_APPEARANCE: AppearanceConfig = {
  bgPrimary: "#1c1f24",
  bgSurface: "#2a2d35",
  bgInput: "#0f1115",
  accentColor: "#dc2626",
  bgFooter: "#000000",
  fontDisplay: "Cormorant Garamond",
  fontBody: "Montserrat",
};

// Mapeo de fonts disponibles a sus imports de Google Fonts
export const AVAILABLE_FONTS = {
  display: {
    "Cormorant Garamond": "Cormorant+Garamond:wght@400;600;700",
    "Playfair Display": "Playfair+Display:wght@400;600;700",
    "DM Serif Display": "DM+Serif+Display:wght@400",
    "Libre Baskerville": "Libre+Baskerville:wght@400;700",
  },
  body: {
    Montserrat: "Montserrat:wght@400;500;600;700",
    Inter: "Inter:wght@400;500;600;700",
    Roboto: "Roboto:wght@400;500;700",
    "Space Grotesk": "Space+Grotesk:wght@400;500;600;700",
  },
} as const;

// ============================================
// QUERIES CON CACHE
// ============================================

/**
 * Obtiene configuraciones de apariencia del grupo "appearance"
 * @returns Objeto con todas las configuraciones de apariencia (con defaults)
 *
 * @example
 * const appearance = await getAppearanceConfigs();
 * // Devuelve: { bgPrimary: "#1c1f24", fontDisplay: "Cormorant Garamond", ... }
 */
export const getAppearanceConfigs = unstable_cache(
  async (): Promise<AppearanceConfig> => {
    try {
      const configs = await prisma.siteConfig.findMany({
        where: {
          group: "appearance",
        },
      });

      // Mapear BD a objeto
      const map: Record<string, string> = {};
      for (const config of configs) {
        map[config.key] = config.value;
      }

      // Retornar con defaults para valores faltantes
      return {
        bgPrimary: map.bg_primary || DEFAULT_APPEARANCE.bgPrimary,
        bgSurface: map.bg_surface || DEFAULT_APPEARANCE.bgSurface,
        bgInput: map.bg_input || DEFAULT_APPEARANCE.bgInput,
        accentColor: map.accent_color || DEFAULT_APPEARANCE.accentColor,
        bgFooter: map.bg_footer || DEFAULT_APPEARANCE.bgFooter,
        fontDisplay: map.font_display || DEFAULT_APPEARANCE.fontDisplay,
        fontBody: map.font_body || DEFAULT_APPEARANCE.fontBody,
      };
    } catch (error) {
      // Si falla (tabla no existe, etc), retornar defaults silenciosamente
      console.warn("[getAppearanceConfigs] Error, using defaults:", error);
      return DEFAULT_APPEARANCE;
    }
  },
  ["appearance-configs"],
  {
    revalidate: 300, // 5 minutos
    tags: ["site-config", "appearance"],
  }
);

// ============================================
// GENERADORES DE CSS
// ============================================

/**
 * Genera string CSS con variables custom basadas en config de BD
 * Para inyectar en <style> tag dentro de <html>
 *
 * @param configs - Configuraciones de apariencia
 * @returns String CSS con variables :root
 *
 * @example
 * const css = generateAppearanceCSS(appearance);
 * // Retorna: ":root { --artgoma-bg-primary: #1c1f24; ... }"
 */
export function generateAppearanceCSS(configs: AppearanceConfig): string {
  return `
    :root {
      /* Colores dinamicos ArtGoMA - gestionados desde CMS */
      --artgoma-bg-primary: ${configs.bgPrimary};
      --artgoma-bg-surface: ${configs.bgSurface};
      --artgoma-bg-input: ${configs.bgInput};
      --artgoma-accent: ${configs.accentColor};
      --artgoma-bg-footer: ${configs.bgFooter};

      /* Tipografias dinamicas */
      --font-display: "${configs.fontDisplay}", Georgia, serif;
      --font-body: "${configs.fontBody}", system-ui, sans-serif;
    }
  `.trim();
}

/**
 * Genera URL de Google Fonts para cargar fonts dinamicamente
 *
 * @param fontDisplay - Nombre de la font display (titulos)
 * @param fontBody - Nombre de la font body (textos)
 * @returns URL de Google Fonts o null si son las defaults de next/font
 *
 * @example
 * const url = generateGoogleFontsURL("Playfair Display", "Inter");
 * // Retorna: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@400;500;600;700&display=swap"
 */
export function generateGoogleFontsURL(
  fontDisplay: string,
  fontBody: string
): string | null {
  const families: string[] = [];

  // Display font
  const displaySpec =
    AVAILABLE_FONTS.display[fontDisplay as keyof typeof AVAILABLE_FONTS.display];
  if (displaySpec) {
    families.push(displaySpec);
  }

  // Body font (solo si no es Montserrat que ya cargamos con next/font)
  if (fontBody !== "Montserrat") {
    const bodySpec =
      AVAILABLE_FONTS.body[fontBody as keyof typeof AVAILABLE_FONTS.body];
    if (bodySpec) {
      families.push(bodySpec);
    }
  }

  // Si no hay fonts extra que cargar, retornar null
  if (families.length === 0) {
    return null;
  }

  // Construir URL
  const familiesParam = families.map((f) => `family=${f}`).join("&");
  return `https://fonts.googleapis.com/css2?${familiesParam}&display=swap`;
}

/**
 * Genera el link tag para cargar fonts de Google Fonts
 * Solo genera si hay fonts diferentes a las default
 *
 * @param fontDisplay - Font para titulos
 * @param fontBody - Font para body
 * @returns HTML string del link tag o string vacio
 */
export function generateFontLinkTag(
  fontDisplay: string,
  fontBody: string
): string {
  const url = generateGoogleFontsURL(fontDisplay, fontBody);
  if (!url) return "";

  return `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="${url}" rel="stylesheet">`;
}

// ============================================
// VERSION SIN CACHE (para admin)
// ============================================

/**
 * Version sin cache de getAppearanceConfigs
 * Usar en admin panel para ver cambios inmediatos
 */
export async function getAppearanceConfigsNoCache(): Promise<AppearanceConfig> {
  try {
    const configs = await prisma.siteConfig.findMany({
      where: {
        group: "appearance",
      },
    });

    const map: Record<string, string> = {};
    for (const config of configs) {
      map[config.key] = config.value;
    }

    return {
      bgPrimary: map.bg_primary || DEFAULT_APPEARANCE.bgPrimary,
      bgSurface: map.bg_surface || DEFAULT_APPEARANCE.bgSurface,
      bgInput: map.bg_input || DEFAULT_APPEARANCE.bgInput,
      accentColor: map.accent_color || DEFAULT_APPEARANCE.accentColor,
      bgFooter: map.bg_footer || DEFAULT_APPEARANCE.bgFooter,
      fontDisplay: map.font_display || DEFAULT_APPEARANCE.fontDisplay,
      fontBody: map.font_body || DEFAULT_APPEARANCE.fontBody,
    };
  } catch (error) {
    console.warn("[getAppearanceConfigsNoCache] Error:", error);
    return DEFAULT_APPEARANCE;
  }
}

// ============================================
// VALIDADORES
// ============================================

/**
 * Valida que un color sea un hex valido
 */
export function isValidHexColor(color: string): boolean {
  return /^#[0-9A-Fa-f]{6}$/.test(color);
}

/**
 * Valida que una font sea de las disponibles
 */
export function isValidFont(
  font: string,
  type: "display" | "body"
): boolean {
  const available = AVAILABLE_FONTS[type];
  return font in available;
}
