// 🧭 MIGA DE PAN: ArtistsCarouselClient - Componente cliente del carousel de artistas
// 📍 UBICACIÓN: src/app/[lang]/components/carousel2/ArtistsCarouselClient.tsx
//
// 🎯 PORQUÉ EXISTE: Renderizar el carousel con Embla (requiere "use client")
// 🎯 CASOS DE USO: Usado por ArtistsCarousel (server component)
//
// 🔄 FLUJO: artists[] → Embla carousel → Image con hover effect
// 🔗 USADO EN: ArtistsCarousel.tsx
// ⚠️ DEPENDENCIAS: embla-carousel-react, next/image
//
// 📋 SPEC: SPEC-26-01-2026-CMS-ContentManager (Tarea 1.9)

"use client";

import { EmblaOptionsType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";

const OPTIONS: EmblaOptionsType = { align: "center", loop: true };

export interface ArtistItem {
  key: string;
  url: string;
  alt: string;
  artistName: string;
  width: number;
  height: number;
}

interface ArtistsCarouselClientProps {
  artists: ArtistItem[];
}

const ArtistsCarouselClient: React.FC<ArtistsCarouselClientProps> = ({
  artists,
}) => {
  const [emblaRef] = useEmblaCarousel(OPTIONS);

  return (
    <div className="embla max-w-full mx-auto bg-artgoma-primary py-16">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {artists.map((img) => (
            <div
              className="flex-none w-5/12 md:w-1/6 lg:w-1/5 px-4 mb-4"
              key={img.key}
            >
              <div className="relative rounded-xl overflow-hidden group">
                <Image
                  className="rounded-xl"
                  width={img.width}
                  height={img.height}
                  src={img.url}
                  alt={img.alt}
                />
                <p className="absolute bottom-1 md:bottom-4 right-0 left-0 z-20 text-white text-center opacity-0 group-hover:opacity-100 duration-300 text-xs md:text-base font-light">
                  {img.artistName}
                </p>
                <div className="absolute bg-gradient-to-t from-black to-black/70 w-full h-64 group-hover:-translate-y-8 md:group-hover:-translate-y-16 duration-300"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArtistsCarouselClient;
