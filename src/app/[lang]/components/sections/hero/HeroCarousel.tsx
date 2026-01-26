// 🧭 MIGA DE PAN: HeroCarousel - Server Component para el carousel del Hero
// 📍 UBICACIÓN: src/app/[lang]/components/sections/hero/HeroCarousel.tsx
//
// 🎯 PORQUÉ EXISTE: Cargar imagenes del hero desde BD con fallback a JSON
// 🎯 CASOS DE USO: Banner principal de la home con imagenes rotativas
//
// 🔄 FLUJO: getSliderBySection("hero") → BD → items[] → HeroCarouselClient
// 🔗 USADO EN: Hero.tsx (reemplaza el Carousel.tsx antiguo)
// ⚠️ DEPENDENCIAS: @/queries/cms (queries con cache), imgsCarousel.json (fallback)
//
// 🚨 CUIDADO: Fallback a JSON si BD vacia - mantener imgsCarousel.json actualizado
// 📋 SPEC: SPEC-26-01-2026-CMS-ContentManager (Tarea Hero Carousel)

import { getSliderBySection } from "@/queries/cms";
import HeroCarouselClient, { HeroImageItem } from "./HeroCarouselClient";
import * as imagesObj from "./imgsCarousel.json";

// Re-export del tipo para conveniencia
export type { HeroImageItem };

const HeroCarousel = async () => {
  // Intentar cargar desde BD primero
  const slider = await getSliderBySection("hero");

  let images: HeroImageItem[];

  if (slider && slider.items && slider.items.length > 0) {
    // Transformar items de BD al formato esperado por HeroCarouselClient
    images = slider.items.map((item, index) => ({
      url: item.url || "",
      alt: item.alt || item.title || `Hero image ${index + 1}`,
      key: `hero-${item.id}`,
      width: item.width || 1920,
      height: item.height || 1080,
    }));
  } else {
    // Fallback a JSON estatico
    images = imagesObj.images;
  }

  return <HeroCarouselClient images={images} />;
};

export default HeroCarousel;
