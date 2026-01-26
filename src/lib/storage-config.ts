// 🧭 MIGA DE PAN: Storage Configuration - Configuracion centralizada de buckets Supabase
// 📍 UBICACION: src/lib/storage-config.ts
// 🎯 PORQUE EXISTE: Centralizar la configuracion de buckets y paths para evitar hardcoding disperso
// 🔄 FLUJO: Componentes/APIs → ESTE CONFIG → Supabase Storage
// 🎯 CASOS DE USO: Upload de imagenes CMS, eventos, sponsors
// ⚠️ DEPENDENCIAS: process.env.NEXT_PUBLIC_SUPABASE_URL
// 🚨 CUIDADO: Si cambias nombres de buckets, verificar que existan en Supabase Dashboard
// 📋 SPEC: SPEC-24-01-2026-001-GranMigracion2026

/**
 * Nombres de los buckets en Supabase Storage
 * - events: Imagenes de eventos (PUBLIC) - YA EXISTE
 * - sponsors: Logos de sponsors (PUBLIC) - YA EXISTE
 * - cms: Contenido del CMS (PUBLIC) - CREAR MANUALMENTE EN SUPABASE
 */
export const STORAGE_BUCKETS = {
  events: 'events',
  sponsors: 'sponsors',
  cms: 'cms'
} as const;

export type StorageBucket = typeof STORAGE_BUCKETS[keyof typeof STORAGE_BUCKETS];

/**
 * Paths dentro del bucket CMS para organizar contenido
 *
 * Estructura:
 * 📁 cms (PUBLIC)
 *    ├── /sliders/
 *    │   ├── /hero/         → Imagenes del hero carousel
 *    │   ├── /live/         → Fotos/videos seccion "Enjoy Live"
 *    │   ├── /stories/      → Imagenes carousel historias
 *    │   ├── /artists/      → Fotos de artistas
 *    │   └── /tickets/      → Golden tickets
 *    └── /general/          → Imagenes generales del sitio
 */
export const CMS_PATHS = {
  sliders: {
    hero: 'sliders/hero',
    live: 'sliders/live',
    stories: 'sliders/stories',
    artists: 'sliders/artists',
    tickets: 'sliders/tickets'
  },
  general: 'general'
} as const;

export type CMSSliderPath = typeof CMS_PATHS.sliders[keyof typeof CMS_PATHS.sliders];
export type CMSPath = CMSSliderPath | typeof CMS_PATHS.general;

/**
 * Genera la URL publica de un archivo en Supabase Storage
 *
 * @param bucket - Nombre del bucket (events, sponsors, cms)
 * @param path - Path completo del archivo dentro del bucket
 * @returns URL publica del archivo
 *
 * @example
 * getPublicUrl('cms', 'sliders/hero/imagen1.jpg')
 * // => https://xxx.supabase.co/storage/v1/object/public/cms/sliders/hero/imagen1.jpg
 */
export const getPublicUrl = (bucket: StorageBucket, path: string): string => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL is not defined');
  }
  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`;
};

/**
 * Genera el path completo para un archivo en el CMS
 *
 * @param cmsPath - Path base dentro del CMS (ej: 'sliders/hero')
 * @param fileName - Nombre del archivo
 * @returns Path completo para usar en upload
 *
 * @example
 * getCMSFilePath('sliders/hero', 'banner.jpg')
 * // => 'sliders/hero/banner.jpg'
 */
export const getCMSFilePath = (cmsPath: CMSPath, fileName: string): string => {
  return `${cmsPath}/${fileName}`;
};

/**
 * Genera un nombre de archivo unico para evitar colisiones
 *
 * @param originalName - Nombre original del archivo
 * @returns Nombre unico con timestamp y random string
 *
 * @example
 * generateUniqueFileName('foto.jpg')
 * // => '1706284800000-a1b2c3.jpg'
 */
export const generateUniqueFileName = (originalName: string): string => {
  const fileExt = originalName.split('.').pop() || 'jpg';
  const uniqueId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  return `${uniqueId}.${fileExt}`;
};

/**
 * Configuracion por defecto para uploads
 */
export const UPLOAD_CONFIG = {
  maxFileSizeMB: 4,
  maxFileSizeBytes: 4 * 1024 * 1024,
  acceptedImageTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'],
  cacheControl: '3600'
} as const;
