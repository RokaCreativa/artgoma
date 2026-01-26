// 🧭 MIGA DE PAN: HeroCarouselClient - Client Component con logica de carousel
// 📍 UBICACIÓN: src/app/[lang]/components/sections/hero/HeroCarouselClient.tsx
//
// 🎯 PORQUÉ EXISTE: Manejo de estado y timer para rotar imagenes del hero
// 🎯 CASOS DE USO: Animacion de fade entre imagenes cada 7 segundos
//
// 🔄 FLUJO: images[] (props) → useState/useEffect → render con opacity transitions
// 🔗 USADO EN: HeroCarousel.tsx (Server Component padre)
// ⚠️ DEPENDENCIAS: Ninguna externa, solo React hooks
//
// 🚨 CUIDADO: El timer se limpia en cleanup del useEffect
// 📋 SPEC: SPEC-26-01-2026-CMS-ContentManager (Tarea Hero Carousel)

"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

// Tipo para los items del Hero carousel (definido aqui para evitar circular import)
export interface HeroImageItem {
  url: string;
  alt: string;
  key: string;
  width: number;
  height: number;
}

interface HeroCarouselClientProps {
  images: HeroImageItem[];
}

const HeroCarouselClient = ({ images }: HeroCarouselClientProps) => {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    if (!images || images.length === 0) {
      return;
    }
    const timer = setInterval(() => {
      setCurrentImage((prevImage) => (prevImage + 1) % images.length);
    }, 7000);

    return () => clearInterval(timer);
  }, [images]);

  const changeImage = (index: number) => {
    setCurrentImage(index);
  };

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div>
      <div className="absolute items-center overflow-hidden z-10">
        {images.map((img, index) => (
          <Image
            className={`h-screen w-screen object-cover ${
              index === currentImage ? "opacity-100" : "opacity-0 absolute"
            } transition-opacity duration-700`}
            src={img.url}
            alt={img.alt}
            key={img.key}
            width={img.width}
            height={img.height}
          />
        ))}
      </div>
      <div className="absolute z-[60] flex justify-center items-center space-x-4 bottom-4 w-full">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => changeImage(index)}
            className={`h-2 w-2 md:w-3 md:h-3 bg-white rounded-full cursor-pointer hover:scale-110 ${
              index === currentImage ? "opacity-100" : "opacity-50"
            }`}
          ></button>
        ))}
      </div>
      <div
        style={{
          background: `linear-gradient(to top, #000000, #00000080 , transparent, transparent)`,
        }}
        className="absolute z-50 h-5/6 w-screen bottom-0"
      ></div>
    </div>
  );
};

export default HeroCarouselClient;
