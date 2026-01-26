// 🧭 MIGA DE PAN: YouTube Utilities - Helpers para trabajar con URLs de YouTube
// 📍 UBICACIÓN: src/lib/cms/youtube.ts
// 🎯 PORQUÉ EXISTE: Extraer IDs de YouTube, generar thumbnails y URLs de embed
// 🔄 FLUJO: URL YouTube → extractYouTubeId() → ID → getEmbedUrl/getThumbnail
// 🚨 CUIDADO: Los formatos de URL de YouTube pueden cambiar
// 📋 SPEC: SPEC-26-01-2026-CMS-ContentManager

/**
 * Extrae el ID de video de cualquier formato de URL de YouTube
 *
 * Formatos soportados:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - https://www.youtube.com/v/VIDEO_ID
 * - VIDEO_ID (solo el ID)
 */
export function extractYouTubeId(input: string): string | null {
  if (!input) return null;

  // Si ya es solo un ID (11 caracteres alfanuméricos con - y _)
  if (/^[a-zA-Z0-9_-]{11}$/.test(input.trim())) {
    return input.trim();
  }

  // Regex para todos los formatos de URL
  const patterns = [
    // youtube.com/watch?v=ID
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    // youtu.be/ID
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    // youtube.com/embed/ID
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    // youtube.com/v/ID
    /(?:youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/,
    // youtube.com/shorts/ID
    /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = input.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

/**
 * Genera la URL del thumbnail de un video de YouTube
 *
 * Calidades disponibles:
 * - default: 120x90
 * - mqdefault: 320x180
 * - hqdefault: 480x360
 * - sddefault: 640x480
 * - maxresdefault: 1280x720 (no siempre disponible)
 */
export function getYouTubeThumbnail(
  videoId: string,
  quality: 'default' | 'mqdefault' | 'hqdefault' | 'sddefault' | 'maxresdefault' = 'hqdefault'
): string {
  return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
}

/**
 * Genera la URL de embed para iframe
 */
export function getYouTubeEmbedUrl(videoId: string, options?: {
  autoplay?: boolean;
  mute?: boolean;
  loop?: boolean;
  controls?: boolean;
}): string {
  const params = new URLSearchParams();

  if (options?.autoplay) params.set('autoplay', '1');
  if (options?.mute) params.set('mute', '1');
  if (options?.loop) {
    params.set('loop', '1');
    params.set('playlist', videoId); // Requerido para loop
  }
  if (options?.controls === false) params.set('controls', '0');

  // Configuración por defecto para mejor UX
  params.set('rel', '0'); // No mostrar videos relacionados
  params.set('modestbranding', '1'); // Branding mínimo

  const queryString = params.toString();
  return `https://www.youtube.com/embed/${videoId}${queryString ? `?${queryString}` : ''}`;
}

/**
 * Valida si una URL/ID es válida para YouTube
 */
export function isValidYouTubeInput(input: string): boolean {
  return extractYouTubeId(input) !== null;
}

/**
 * Obtiene la URL de watch de YouTube
 */
export function getYouTubeWatchUrl(videoId: string): string {
  return `https://www.youtube.com/watch?v=${videoId}`;
}
