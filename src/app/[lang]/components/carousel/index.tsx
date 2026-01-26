// 🧭 MIGA DE PAN: Carousel Index - Re-export del LogoCarousel
// 📍 UBICACIÓN: src/app/[lang]/components/carousel/index.tsx
//
// 🎯 PORQUÉ EXISTE: Mantener compatibilidad con imports existentes
// 🔄 FLUJO: import LogoCarousel from "@/components/carousel" funciona
//
// 📋 SPEC: SPEC-26-01-2026-CMS-ContentManager (Tarea 1.9)

export { default } from "./LogoCarousel";
export { default as LogoCarousel } from "./LogoCarousel";
export { default as LogoCarouselClient } from "./LogoCarouselClient";
export type { BrandItem } from "./LogoCarousel";
