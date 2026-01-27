// MIGA DE PAN: GoldenTicketsCarousel - Server Component para carousel de tickets VIP
// UBICACION: src/app/[lang]/components/carousel-tickets/GoldenTicketsCarousel.tsx
//
// PORQUE EXISTE: Obtener tickets desde BD con fallback a JS hardcodeado
// FLUJO: getSliderBySection("tickets") -> GoldenTicketsCarouselClient -> CSS scroll
// USADO EN: page.tsx principal
// DEPENDENCIAS: @/queries/cms, GoldenTicketsCarouselClient
//
// SPEC: SPEC-26-01-2026-CMS-ContentManager

import { getSliderBySection } from "@/queries/cms";
import GoldenTicketsCarouselClient, { TicketItem } from "./GoldenTicketsCarouselClient";
import { useCarouselGoldenTickets } from "./useCarouselGoldenTickets";

const GoldenTicketsCarousel = async () => {
  // Intentar obtener tickets desde BD
  const slider = await getSliderBySection("tickets");

  let tickets: TicketItem[];

  if (slider && slider.items && slider.items.length > 0) {
    // Usar datos de BD
    tickets = slider.items
      .filter((item) => item.isActive)
      .sort((a, b) => a.position - b.position)
      .map((item) => ({
        imageUrl: item.url || "",
        alt: item.alt || item.title || "Golden Ticket",
        width: item.width || 180,
        height: item.height || 330,
      }));
  } else {
    // Fallback a JS si BD vacia (solo los 5 unicos, sin duplicados)
    const fallbackData = useCarouselGoldenTickets();
    // Tomar solo los primeros 5 (los unicos, el resto son duplicados)
    tickets = fallbackData.slice(0, 5).map((item) => ({
      imageUrl: item.imageUrl,
      alt: item.alt,
      width: item.width,
      height: item.height,
    }));
  }

  return <GoldenTicketsCarouselClient tickets={tickets} />;
};

export default GoldenTicketsCarousel;
