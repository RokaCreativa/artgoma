// 🧭 MIGA DE PAN: EmblaCarousel2 - Embla carousel para videos con soporte YouTube
// 📍 UBICACIÓN: src/app/[lang]/components/sections/carousel2/EmblaCarousel2.tsx
//
// 🎯 PORQUÉ EXISTE: Carousel horizontal de videos con botones prev/next
// 🎯 CASOS DE USO: Videos de stories/historias - MP4 o YouTube
//
// 🔄 FLUJO: slides[] → map → Video o YouTubeEmbed según type
// 🔗 USADO EN: Carousel2.tsx
// ⚠️ DEPENDENCIAS: embla-carousel-react, Video.tsx, YouTubeEmbed.tsx
//
// 🚨 CUIDADO: El type determina si es video MP4 o YouTube embed
// 📋 SPEC: SPEC-26-01-2026-CMS-ContentManager (Tarea 1.9)

"use client";

import { EmblaOptionsType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import {
  NextButton,
  PrevButton,
  usePrevNextButtons,
} from "./EmblaCarousel2ArrowButtons";
import Video from "./Video";
import YouTubeEmbed from "@/app/[lang]/components/YouTubeEmbed";
import type { CarouselVideoItem } from "./Carousel2";

type PropType = {
  slides: CarouselVideoItem[];
  options?: EmblaOptionsType;
};

const EmblaCarousel: React.FC<PropType> = (props) => {
  const { slides, options } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel(options);

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi);

  return (
    <div className="max-w-full mx-auto">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {slides.map((slide) => {
            // Determinar si es YouTube o video MP4
            const isYouTube =
              slide.type === "youtube" || slide.format === "youtube";

            if (isYouTube && slide.youtubeId) {
              return (
                <div
                  key={slide.key}
                  className="flex-none h-[420px] md:h-[580px] w-4/5 md:w-[45%] lg:w-[30%] px-2 md:px-4 lg:px-6 py-6"
                >
                  <YouTubeEmbed
                    youtubeId={slide.youtubeId}
                    title={slide.title || slide.alt}
                    aspectRatio="vertical"
                    autoplay={false}
                    showControls={true}
                    liteMode={true}
                    className="h-full w-full shadow-gray-800 shadow-lg"
                    thumbnailQuality="hqdefault"
                  />
                </div>
              );
            }

            // Video MP4 (formato original)
            return (
              <Video
                key={slide.key}
                historie={{
                  url: slide.url,
                  alt: slide.alt,
                  format: slide.format,
                  key: slide.key,
                  width: slide.width,
                  height: slide.height,
                }}
              />
            );
          })}
        </div>
      </div>

      <div className="hidden md:flex justify-center -translate-y-32 relative z-50">
        <div className="flex justify-between w-full">
          <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
          <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
        </div>
      </div>
    </div>
  );
};

export default EmblaCarousel;
