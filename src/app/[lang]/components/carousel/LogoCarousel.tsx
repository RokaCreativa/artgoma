// 🧭 MIGA DE PAN: LogoCarousel - Carousel de logos/marcas (Server Component)
// 📍 UBICACIÓN: src/app/[lang]/components/carousel/LogoCarousel.tsx
//
// 🎯 PORQUÉ EXISTE: Mostrar logos de sponsors/marcas con animación infinita
// 🎯 CASOS DE USO: Footer o sección de sponsors
//
// 🔄 FLUJO: getSliderBySection("brands") → BD → items[] → LogoCarouselClient
// 🔗 USADO EN: Home page, sección sponsors
// ⚠️ DEPENDENCIAS: @/queries/cms (queries con cache), useCarouselBrands.js (fallback)
//
// 🚨 CUIDADO: Fallback a hook hardcodeado si BD vacía
// 📋 SPEC: SPEC-26-01-2026-CMS-ContentManager (Tarea 1.9)

import { getSliderBySection } from "@/queries/cms";
import LogoCarouselClient from "./LogoCarouselClient";
import { useCarouselBrands } from "./useCarouselBrands";

// Tipo para los items del carousel de brands
export interface BrandItem {
  imageUrl: string;
  alt: string;
  width: number;
  height: number;
  text?: string;
  textSize?: string;
}

const LogoCarousel = async () => {
  // Intentar cargar desde BD primero
  const slider = await getSliderBySection("brands");

  let brands: BrandItem[];

  if (slider && slider.items && slider.items.length > 0) {
    // Transformar items de BD al formato esperado
    brands = slider.items.map((item, index) => ({
      imageUrl: item.url || "",
      alt: item.alt || item.title || `Brand ${index + 1}`,
      width: item.width || 200,
      height: item.height || 100,
      text: "",
      textSize: "",
    }));
  } else {
    // Fallback a datos hardcodeados
    brands = useCarouselBrands();
  }

  return <LogoCarouselClient brands={brands} />;
};

export default LogoCarousel;
