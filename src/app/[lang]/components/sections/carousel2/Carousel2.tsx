// 🧭 MIGA DE PAN: Carousel2 - Carousel de videos/stories para la home
// 📍 UBICACIÓN: src/app/[lang]/components/sections/carousel2/Carousel2.tsx
//
// 🎯 PORQUÉ EXISTE: Mostrar videos de historias/stories en la página principal
// 🎯 CASOS DE USO: Sección "Stories" con videos de artistas/eventos
//
// 🔄 FLUJO: getSliderBySection("stories") → BD → items[] → EmblaCarousel2
// 🔗 USADO EN: Home page, sección stories
// ⚠️ DEPENDENCIAS: @/queries/cms (queries con cache), histories.json (fallback)
//
// 🚨 CUIDADO: Fallback a JSON si BD vacía - mantener histories.json actualizado
// 📋 SPEC: SPEC-26-01-2026-CMS-ContentManager (Tarea 1.9)

import EmblaCarousel2 from "./EmblaCarousel2";
import { EmblaOptionsType } from "embla-carousel";
import { getSliderBySection } from "@/queries/cms";
import * as historiesObj from "./histories.json";

const OPTIONS: EmblaOptionsType = { loop: true };

// Tipo para los items del carousel
export interface CarouselVideoItem {
  url: string;
  alt: string;
  format: string;
  key: string;
  width: number;
  height: number;
  // Para items de BD con YouTube
  type?: "youtube" | "image" | "video_url";
  youtubeId?: string | null;
  title?: string | null;
}

const Carousel2 = async () => {
  console.log('[Carousel2] 🚀 INICIO - Cargando slider stories...');

  // Intentar cargar desde BD primero
  const slider = await getSliderBySection("stories");

  // DEBUG: Log slider data
  console.log('[Carousel2] ✅ Slider loaded:', slider ? {
    name: slider.name,
    itemsCount: slider.items.length,
    isActive: slider.isActive
  } : '❌ NULL - usando fallback');

  if (slider?.items) {
    console.log('[Carousel2] 📦 TODOS los items de BD:', slider.items.map(i => ({
      id: i.id,
      type: i.type,
      youtubeId: i.youtubeId,
      url: i.url?.substring(0, 50),
      isActive: i.isActive,
      position: i.position
    })));

    const youtubeItems = slider.items.filter(i => i.type === 'youtube');
    console.log('[Carousel2] 🎬 YouTube items:', youtubeItems.length, 'de', slider.items.length);
  }

  let slides: CarouselVideoItem[];

  if (slider && slider.items && slider.items.length > 0) {
    // Transformar items de BD al formato esperado por EmblaCarousel2
    slides = slider.items.map((item, index) => ({
      url:
        item.type === "youtube"
          ? `https://www.youtube.com/embed/${item.youtubeId}`
          : item.url || "",
      alt: item.alt || item.title || `Video ${index + 1}`,
      format: item.type === "youtube" ? "youtube" : "video/mp4",
      key: `item-${item.id}`,
      width: item.width || 250,
      height: item.height || 350,
      type: item.type as "youtube" | "image" | "video_url",
      youtubeId: item.youtubeId,
      title: item.title,
    }));
  } else {
    // Fallback a JSON estático
    slides = historiesObj.histories;
  }

  return (
    <div
      id="stories"
      className="overflow-x-hidden bg-[#1c1f24] py-20 px-10 lg:px-20 md:pt-40"
    >
      <EmblaCarousel2 slides={slides} options={OPTIONS} />
    </div>
  );
};

export default Carousel2;
