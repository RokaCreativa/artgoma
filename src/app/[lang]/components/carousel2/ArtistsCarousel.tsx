// 🧭 MIGA DE PAN: ArtistsCarousel - Server Component para carousel de artistas
// 📍 UBICACIÓN: src/app/[lang]/components/carousel2/ArtistsCarousel.tsx
//
// 🎯 PORQUÉ EXISTE: Obtener artistas desde BD con fallback a JSON
// 🔄 FLUJO: getSliderBySection("artists") → ArtistsCarouselClient → Embla
// 🔗 USADO EN: page.tsx principal
// ⚠️ DEPENDENCIAS: @/queries/cms, ArtistsCarouselClient
//
// 📋 SPEC: SPEC-26-01-2026-CMS-ContentManager (Tarea 1.9)

import { getSliderBySection } from "@/queries/cms";
import ArtistsCarouselClient, { ArtistItem } from "./ArtistsCarouselClient";
import * as fallbackData from "./imgs-artists.json";

const ArtistsCarousel = async () => {
  // Intentar obtener artistas desde BD
  const slider = await getSliderBySection("artists");

  let artists: ArtistItem[];

  if (slider && slider.items && slider.items.length > 0) {
    // Usar datos de BD
    artists = slider.items
      .filter((item) => item.isActive)
      .sort((a, b) => a.position - b.position)
      .map((item) => ({
        key: `artist-${item.id}`,
        url: item.url || "",
        alt: item.alt || item.artistName || "Artist",
        artistName: item.artistName || item.title || "",
        width: item.width || 320,
        height: item.height || 420,
      }));
  } else {
    // Fallback a JSON si BD vacía
    artists = fallbackData.imagesArtists.map((img) => ({
      key: img.key,
      url: img.url,
      alt: img.alt || img.artistName,
      artistName: img.artistName,
      width: img.width,
      height: img.height,
    }));
  }

  return <ArtistsCarouselClient artists={artists} />;
};

export default ArtistsCarousel;
