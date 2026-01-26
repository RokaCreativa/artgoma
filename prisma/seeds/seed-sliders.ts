/**
 * SEED: Sliders con Items
 * SPEC: SPEC-26-01-2026-CMS-ContentManager
 *
 * Migra los datos de sliders desde los JSONs hardcodeados:
 * - imgsCarousel.json (hero banner - section: "hero")
 * - histories.json (videos carousel - section: "stories")
 * - imgs-artists.json (artistas carousel - section: "artists")
 * - slides.json (imagenes live - section: "live")
 * - useCarouselBrands.js (logos brands - section: "brands")
 *
 * Usa upsert por slug para ser idempotente.
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ============================================
// DATOS DE SLIDERS (extraidos de JSONs)
// ============================================

// Videos Stories (histories.json)
const STORIES_VIDEOS = [
  { url: "https://aslzzjjkccbfmmeeqbhy.supabase.co/storage/v1/object/public/events/videos/videoCarousel1.mp4", key: "video 1", width: 250, height: 350 },
  { url: "https://aslzzjjkccbfmmeeqbhy.supabase.co/storage/v1/object/public/events/videos/videoCarousel2.mp4", key: "video 2", width: 250, height: 350 },
  { url: "https://aslzzjjkccbfmmeeqbhy.supabase.co/storage/v1/object/public/events/videos/videoCarousel3.mp4", key: "video 3", width: 250, height: 350 },
  { url: "https://aslzzjjkccbfmmeeqbhy.supabase.co/storage/v1/object/public/events/videos/videoCarousel4.mp4", key: "video 4", width: 250, height: 350 },
  { url: "https://aslzzjjkccbfmmeeqbhy.supabase.co/storage/v1/object/public/events/videos/videoCarousel5.mp4", key: "video 5", width: 250, height: 350 },
  { url: "https://aslzzjjkccbfmmeeqbhy.supabase.co/storage/v1/object/public/events/videos/videoCarousel6.mp4", key: "video 6", width: 250, height: 350 },
  { url: "https://aslzzjjkccbfmmeeqbhy.supabase.co/storage/v1/object/public/events/videos/videoCarousel7.mp4", key: "video 7", width: 250, height: 350 },
  { url: "https://aslzzjjkccbfmmeeqbhy.supabase.co/storage/v1/object/public/events/videos/videoCarousel8.mp4", key: "video 8", width: 250, height: 350 },
  { url: "https://aslzzjjkccbfmmeeqbhy.supabase.co/storage/v1/object/public/events/videos/videoCarousel9.mp4", key: "video 9", width: 250, height: 350 },
  { url: "https://aslzzjjkccbfmmeeqbhy.supabase.co/storage/v1/object/public/events/videos/videoCarousel10.mp4", key: "video 10", width: 250, height: 350 },
  { url: "https://aslzzjjkccbfmmeeqbhy.supabase.co/storage/v1/object/public/events/videos/videoCarousel11.mp4", key: "video 11", width: 250, height: 350 },
  { url: "https://aslzzjjkccbfmmeeqbhy.supabase.co/storage/v1/object/public/events/videos/videoCarousel12.mp4", key: "video 12", width: 250, height: 350 },
];

// Artistas (imgs-artists.json)
const ARTISTS = [
  { url: "/img-carousel-artist-01.avif", alt: "carousel image Victor Ezquerro", artistName: "Victor Ezquerro", width: 320, height: 420 },
  { url: "/img-carousel-artist-02.avif", alt: "carousel image Juan Carlos", artistName: "Juan Carlos", width: 320, height: 420 },
  { url: "/img-carousel-artist-03.avif", alt: "carousel image Conrado", artistName: "Conrado", width: 320, height: 420 },
  { url: "/img-carousel-artist-04.avif", alt: "carousel image Diaconescu", artistName: "Diaconescu", width: 320, height: 420 },
  { url: "/img-carousel-artist-05.avif", alt: "carousel image Ariam", artistName: "Ariam", width: 320, height: 420 },
  { url: "/img-carousel-artist-06.avif", alt: "carousel image Tosco", artistName: "Tosco", width: 320, height: 420 },
  { url: "/img-carousel-artist-07.avif", alt: "carousel image Ungureanu", artistName: "Ungureanu", width: 320, height: 420 },
  { url: "/img-carousel-artist-08.avif", alt: "carousel image Juan Hernandez", artistName: "Juan Hernandez", width: 320, height: 420 },
  { url: "/img-carousel-artist-09.avif", alt: "carousel image Petru", artistName: "Petru", width: 320, height: 420 },
];

// Live Images/Videos (slides.json)
const LIVE_SLIDES = [
  { url: "https://aslzzjjkccbfmmeeqbhy.supabase.co/storage/v1/object/public/events/videos/videoCarousel14.mp4", alt: "video 1", type: "video_url", width: 600, height: 500 },
  { url: "/carouselImage1.avif", alt: "image 1", type: "image", width: 500, height: 1000 },
  { url: "/carouselImage3.jpg", alt: "image 3", type: "image", width: 500, height: 1000 },
  { url: "/carouselImage2.avif", alt: "image 2", type: "image", width: 500, height: 1000 },
  { url: "https://aslzzjjkccbfmmeeqbhy.supabase.co/storage/v1/object/public/events/videos/videoCarousel13.mp4", alt: "video 2", type: "video_url", width: 600, height: 500 },
  { url: "/carouselImage4.jpg", alt: "image 4", type: "image", width: 500, height: 1000 },
  { url: "/carouselImage5.jpg", alt: "image 5", type: "image", width: 500, height: 1000 },
  { url: "/carouselImage6.jpg", alt: "image 6", type: "image", width: 500, height: 1000 },
  { url: "/carouselImage7.avif", alt: "image 7", type: "image", width: 500, height: 1000 },
  { url: "/carouselImage8.avif", alt: "image 8", type: "image", width: 500, height: 1000 },
  { url: "/carouselImage9.avif", alt: "image 9", type: "image", width: 500, height: 1000 },
];

// Brands/Sponsors (useCarouselBrands.js) - solo unicos, no duplicados
const BRANDS = [
  { url: "/brand-logo-helidream-helicopters.avif", alt: "brand-logo-helidream-helicopters", width: 300, height: 100 },
  { url: "/brand-logo-logo-roca.avif", alt: "brand-logo-logo-roca", width: 150, height: 150 },
  { url: "/brand-logo-roca-creativa.avif", alt: "brand-logo-roca-creativa", width: 200, height: 100 },
  { url: "/brand-logo-top-art-news.png", alt: "brand-logo-top-art-news", width: 200, height: 50 },
  { url: "/brand-logo-top-art-prices.png", alt: "brand-logo-top-art-prices", width: 200, height: 200 },
];

// Hero Carousel (imgsCarousel.json) - imagenes principales del banner
const HERO_IMAGES = [
  { url: "/bannerImage5.avif", alt: "image 5", width: 1920, height: 1080 },
  { url: "/imagebanner2.webp", alt: "image 2", width: 1920, height: 1080 },
  { url: "/bannerImage3.avif", alt: "image 3", width: 1920, height: 1080 },
  { url: "/bannerImage1.avif", alt: "image 1", width: 1920, height: 1080 },
  { url: "/bannerImage4.avif", alt: "image 4", width: 1920, height: 1080 },
  { url: "/bannerImage6.avif", alt: "image 6", width: 1920, height: 1080 },
];

// ============================================
// DEFINICION DE SLIDERS
// ============================================

interface SliderDefinition {
  name: string;
  slug: string;
  section: string;
  description: string;
  items: Array<{
    type: string;
    url?: string;
    youtubeId?: string;
    title?: string;
    alt?: string;
    artistName?: string;
    width?: number;
    height?: number;
  }>;
}

const SLIDERS: SliderDefinition[] = [
  {
    name: "Hero Carousel",
    slug: "hero-carousel",
    section: "hero",
    description: "Carousel principal del banner hero con imagenes de fondo",
    items: HERO_IMAGES.map((img) => ({
      type: "image",
      url: img.url,
      title: img.alt,
      alt: img.alt,
      width: img.width,
      height: img.height,
    })),
  },
  {
    name: "Videos Historias",
    slug: "videos-stories",
    section: "stories",
    description: "Carousel de videos de historias del arte",
    items: STORIES_VIDEOS.map((v, i) => ({
      type: "video_url",
      url: v.url,
      title: v.key,
      alt: v.key,
      width: v.width,
      height: v.height,
    })),
  },
  {
    name: "Artistas",
    slug: "artists",
    section: "artists",
    description: "Carousel de artistas de la galeria",
    items: ARTISTS.map((a) => ({
      type: "image",
      url: a.url,
      title: a.artistName,
      alt: a.alt,
      artistName: a.artistName,
      width: a.width,
      height: a.height,
    })),
  },
  {
    name: "Live Gallery",
    slug: "live-gallery",
    section: "live",
    description: "Imagenes y videos del arte en vivo",
    items: LIVE_SLIDES.map((s) => ({
      type: s.type,
      url: s.url,
      title: s.alt,
      alt: s.alt,
      width: s.width,
      height: s.height,
    })),
  },
  {
    name: "Sponsors y Marcas",
    slug: "brands",
    section: "brands",
    description: "Logos de sponsors y colaboradores",
    items: BRANDS.map((b) => ({
      type: "image",
      url: b.url,
      title: b.alt.replace("brand-logo-", "").replace(/-/g, " "),
      alt: b.alt,
      width: b.width,
      height: b.height,
    })),
  },
];

/**
 * Seed de sliders
 */
export async function seedSliders(): Promise<void> {
  console.log("\n--- SEED: Sliders ---\n");

  let slidersCreated = 0;
  let slidersUpdated = 0;
  let itemsCreated = 0;
  let errors = 0;

  for (const sliderDef of SLIDERS) {
    try {
      // Verificar si existe el slider por slug
      const existing = await prisma.slider.findUnique({
        where: { slug: sliderDef.slug },
        include: { items: true },
      });

      let slider;

      if (existing) {
        // Actualizar slider existente
        slider = await prisma.slider.update({
          where: { slug: sliderDef.slug },
          data: {
            name: sliderDef.name,
            section: sliderDef.section,
            description: sliderDef.description,
            isActive: true,
          },
        });
        slidersUpdated++;
        console.log(`  [UPDATE] Slider: ${sliderDef.name} (${sliderDef.slug})`);

        // Eliminar items existentes para recrearlos
        await prisma.sliderItem.deleteMany({
          where: { sliderId: slider.id },
        });
        console.log(`    - Eliminados ${existing.items.length} items existentes`);
      } else {
        // Crear nuevo slider
        slider = await prisma.slider.create({
          data: {
            name: sliderDef.name,
            slug: sliderDef.slug,
            section: sliderDef.section,
            description: sliderDef.description,
            isActive: true,
            position: SLIDERS.indexOf(sliderDef),
          },
        });
        slidersCreated++;
        console.log(`  [CREATE] Slider: ${sliderDef.name} (${sliderDef.slug})`);
      }

      // Crear items
      for (let i = 0; i < sliderDef.items.length; i++) {
        const item = sliderDef.items[i];
        await prisma.sliderItem.create({
          data: {
            sliderId: slider.id,
            type: item.type,
            url: item.url,
            youtubeId: item.youtubeId,
            title: item.title,
            alt: item.alt,
            artistName: item.artistName,
            width: item.width,
            height: item.height,
            position: i,
            isActive: true,
          },
        });
        itemsCreated++;
      }
      console.log(`    + Creados ${sliderDef.items.length} items`);
    } catch (error) {
      errors++;
      console.error(`  [ERROR] Slider ${sliderDef.slug}:`, error);
    }
  }

  console.log("\n--- Resumen Sliders ---");
  console.log(`  Sliders creados: ${slidersCreated}`);
  console.log(`  Sliders actualizados: ${slidersUpdated}`);
  console.log(`  Items creados: ${itemsCreated}`);
  console.log(`  Errores: ${errors}`);
}

// Ejecutar si se llama directamente
if (require.main === module) {
  seedSliders()
    .then(() => {
      console.log("\nSeed de sliders completado.");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Error en seed de sliders:", error);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
