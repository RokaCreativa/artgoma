/**
 * SEED PRINCIPAL - Ejecuta todos los seeds
 * SPEC: SPEC-26-01-2026-CMS-ContentManager
 *
 * Uso: npx tsx prisma/seeds/seed.ts
 * O via package.json: npm run db:seed
 *
 * Orden de ejecucion:
 * 1. Config (SiteConfig) - configuracion basica del sitio
 * 2. Content (SectionContent) - textos multiidioma
 * 3. Sliders (Slider + SliderItem) - carousels con items
 *
 * NOTA: Todos los seeds son idempotentes (usan upsert),
 * por lo que se pueden ejecutar multiples veces sin duplicar datos.
 */

import { PrismaClient } from "@prisma/client";
import { seedConfig } from "./seed-config";
import { seedContent } from "./seed-content";
import { seedSliders } from "./seed-sliders";

const prisma = new PrismaClient();

async function main(): Promise<void> {
  console.log("╔══════════════════════════════════════════════════════════╗");
  console.log("║           ARTGOMA CMS - DATABASE SEED                    ║");
  console.log("║       SPEC: SPEC-26-01-2026-CMS-ContentManager           ║");
  console.log("╚══════════════════════════════════════════════════════════╝");

  const startTime = Date.now();

  try {
    // 1. Seed de configuracion
    console.log("\n[1/3] Ejecutando seed de configuracion...");
    await seedConfig();

    // 2. Seed de contenido multiidioma
    console.log("\n[2/3] Ejecutando seed de contenido...");
    await seedContent();

    // 3. Seed de sliders
    console.log("\n[3/3] Ejecutando seed de sliders...");
    await seedSliders();

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    console.log("\n╔══════════════════════════════════════════════════════════╗");
    console.log("║                    SEED COMPLETADO                       ║");
    console.log(`║                    Tiempo: ${duration}s                          ║`);
    console.log("╚══════════════════════════════════════════════════════════╝");
  } catch (error) {
    console.error("\n[ERROR] Seed fallido:", error);
    throw error;
  }
}

// Ejecutar
main()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error fatal en seed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
