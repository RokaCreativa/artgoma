// 🧭 MIGA DE PAN: LogoCarouselClient - Componente cliente del carousel de logos
// 📍 UBICACIÓN: src/app/[lang]/components/carousel/LogoCarouselClient.tsx
//
// 🎯 PORQUÉ EXISTE: Renderizar el carousel con animación CSS infinita
// 🎯 CASOS DE USO: Usado por LogoCarousel (server component)
//
// 🔄 FLUJO: brands[] → duplicado para loop infinito → CSS animation
// 🔗 USADO EN: LogoCarousel.tsx
// ⚠️ DEPENDENCIAS: next/image, CSS animate-loop-scroll
//
// 📋 SPEC: SPEC-26-01-2026-CMS-ContentManager (Tarea 1.9)

"use client";

import Image from "next/image";
import type { BrandItem } from "./LogoCarousel";

interface LogoCarouselClientProps {
  brands: BrandItem[];
}

const LogoCarouselClient: React.FC<LogoCarouselClientProps> = ({ brands }) => {
  return (
    <section className="bg-[var(--artgoma-bg-primary)] w-full inline-flex flex-nowrap overflow-x-hidden pb-8 lg:h-64">
      <ul className="flex items-center space-x-4 lg:space-x-16 animate-loop-scroll px-0 lg:px-8 [&_li]:mx-4 [&_img]:max-w-none">
        {brands.map((item, i) => {
          return (
            <li key={`brand-1-${i}`}>
              <Image src={item.imageUrl} alt={item.alt} width={item.width} height={item.height} />
            </li>
          );
        })}
      </ul>
      <ul
        className="flex items-center space-x-4 lg:space-x-16 animate-loop-scroll px-0 lg:px-8 [&_li]:mx-4 [&_img]:max-w-none"
        aria-hidden="true"
      >
        {brands.map((item, i) => {
          return (
            <li key={`brand-2-${i}`}>
              <Image src={item.imageUrl} alt={item.alt} width={item.width} height={item.height} />
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default LogoCarouselClient;
