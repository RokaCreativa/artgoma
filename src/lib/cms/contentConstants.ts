// 🧭 MIGA DE PAN: Constantes del CMS Content
// 📍 UBICACIÓN: src/lib/cms/contentConstants.ts
// 🎯 PORQUÉ EXISTE: Separar constantes de server actions (Next.js 16 requirement)
// 📋 SPEC: SPEC-26-01-2026-CMS-ContentManager

/**
 * Secciones válidas del sitio
 * Deben coincidir con los keys usados en dictionaries/*.json y sectionSchemas.ts
 */
export const VALID_SECTIONS = [
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
] as const;

/**
 * Idiomas soportados
 */
export const VALID_LOCALES = ["es", "en", "de", "fr", "it", "ru"] as const;

// Tipos derivados
export type SectionKey = (typeof VALID_SECTIONS)[number];
export type Locale = (typeof VALID_LOCALES)[number];
