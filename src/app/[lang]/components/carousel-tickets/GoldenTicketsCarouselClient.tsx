// MIGA DE PAN: GoldenTicketsCarouselClient - Client Component para render de tickets
// UBICACION: src/app/[lang]/components/carousel-tickets/GoldenTicketsCarouselClient.tsx
//
// PORQUE EXISTE: Renderizar el carousel con CSS animation scroll infinito
// FLUJO: tickets[] -> duplicar para scroll -> render con animate-loop-scroll-right
// USADO EN: GoldenTicketsCarousel.tsx (Server Component)
//
// SPEC: SPEC-26-01-2026-CMS-ContentManager

"use client";

import Image from "next/image";

export interface TicketItem {
  imageUrl: string;
  alt: string;
  width: number;
  height: number;
}

interface Props {
  tickets: TicketItem[];
}

const GoldenTicketsCarouselClient = ({ tickets }: Props) => {
  // Duplicar items para efecto de scroll infinito
  const duplicatedTickets = [...tickets, ...tickets];

  return (
    <section className="bg-[var(--artgoma-bg-primary)] w-full inline-flex flex-nowrap overflow-x-hidden pb-8 lg:h-80">
      <ul className="flex items-center space-x-4 lg:space-x-16 animate-loop-scroll-right px-0 lg:px-8 [&_li]:mx-4 [&_img]:max-w-none">
        {duplicatedTickets.map((item, i) => (
          <li key={`ticket-${i}`}>
            <Image
              className="rounded-xl"
              src={item.imageUrl}
              alt={item.alt}
              width={item.width}
              height={item.height}
            />
          </li>
        ))}
      </ul>
      <ul
        className="flex items-center space-x-4 lg:space-x-16 animate-loop-scroll-right px-0 lg:px-8 [&_li]:mx-4 [&_img]:max-w-none"
        aria-hidden="true"
      >
        {duplicatedTickets.map((item, i) => (
          <li key={`ticket-dup-${i}`}>
            <Image
              className="rounded-xl"
              src={item.imageUrl}
              alt={item.alt}
              width={item.width}
              height={item.height}
            />
          </li>
        ))}
      </ul>
    </section>
  );
};

export default GoldenTicketsCarouselClient;
