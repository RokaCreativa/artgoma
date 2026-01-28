// 🧭 MIGA DE PAN: Carousel - Carousel de imágenes/videos live para la home
// 📍 UBICACIÓN: src/app/[lang]/components/sections/carousel/Carousel.tsx
//
// 🎯 PORQUÉ EXISTE: Mostrar galería de fotos y videos del evento en vivo
// 🎯 CASOS DE USO: Sección "Enjoy Live" con mezcla de imágenes y videos
//
// 🔄 FLUJO: getSliderBySection("live") → BD → items[] → EmblaCarousel
// 🔗 USADO EN: Home page, sección enjoy-live
// ⚠️ DEPENDENCIAS: @/queries/cms (queries con cache), slides.json (fallback)
//
// 🚨 CUIDADO: Fallback a JSON si BD vacía - mantener slides.json actualizado
// 📋 SPEC: SPEC-26-01-2026-CMS-ContentManager (Tarea 1.9)

import { EmblaOptionsType } from "embla-carousel";
import { getSliderBySection } from "@/queries/cms";
import EmblaCarousel from "./EmblaCarousel";
import H1Carousel from "./H1Carousel";
import * as imagesObj from "./slides.json";

const OPTIONS: EmblaOptionsType = { loop: true };

// Tipo para los items del carousel
export interface CarouselSlideItem {
  video?: boolean;
  url: string;
  alt: string;
  key: string;
  width: number;
  height: number;
  // Para items de BD con YouTube
  type?: "youtube" | "image" | "video_url";
  youtubeId?: string | null;
  title?: string | null;
}

const Carousel = async () => {
  // Intentar cargar desde BD primero
  const slider = await getSliderBySection("live");

  let slides: CarouselSlideItem[];

  if (slider && slider.items && slider.items.length > 0) {
    // Transformar items de BD al formato esperado por EmblaCarousel
    // Filtrar por isActive y ordenar por position
    slides = slider.items
      .filter((item) => item.isActive)
      .sort((a, b) => a.position - b.position)
      .map((item, index) => ({
      // video: true si es video_url o youtube
      video: item.type === "video_url" || item.type === "youtube",
      url:
        item.type === "youtube"
          ? `https://www.youtube.com/embed/${item.youtubeId}`
          : item.url || "",
      alt: item.alt || item.title || `Slide ${index + 1}`,
      key: `slide-${item.id}`,
      width: item.width || 500,
      height: item.height || 1000,
      type: item.type as "youtube" | "image" | "video_url",
      youtubeId: item.youtubeId,
      title: item.title,
    }));
  } else {
    // Fallback a JSON estático
    slides = imagesObj.images;
  }

  return (
    <div id="enjoy-live" className="py-8 bg-artgoma-primary">
      <div className="flex justify-center my-8 md:my-10 px-6">
        <H1Carousel />
      </div>

      <EmblaCarousel slides={slides} options={OPTIONS} />
    </div>
  );
};

export default Carousel;
