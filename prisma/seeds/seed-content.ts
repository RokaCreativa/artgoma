/**
 * SEED: Contenido Multiidioma (SectionContent)
 * SPEC: SPEC-26-01-2026-CMS-ContentManager
 *
 * Migra los textos de dictionaries/*.json a la tabla SectionContent
 * Usa upsert para ser idempotente (puede ejecutarse multiples veces)
 */

import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

// Locales soportados
const LOCALES = ["es", "en", "de", "fr", "it", "ru"] as const;
type Locale = (typeof LOCALES)[number];

// Secciones que vienen de los dictionaries
const SECTIONS = [
  "home",
  "enjoy",
  "connect",
  "inspire",
  "contact",
  "getInTouch",
  "welcomePage",
  "navbar",
  "dropdown",
  "form",
] as const;

interface DictionaryData {
  [key: string]: unknown;
}

/**
 * Lee un archivo JSON de diccionario
 */
function readDictionary(locale: Locale): DictionaryData | null {
  const filePath = path.join(
    process.cwd(),
    "dictionaries",
    `${locale}.json`
  );

  try {
    const content = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(content);
  } catch (error) {
    console.error(`Error leyendo ${filePath}:`, error);
    return null;
  }
}

/**
 * Seed de contenido multiidioma
 */
export async function seedContent(): Promise<void> {
  console.log("\n--- SEED: Contenido Multiidioma ---\n");

  let created = 0;
  let updated = 0;
  let errors = 0;

  for (const locale of LOCALES) {
    const dictionary = readDictionary(locale);
    if (!dictionary) {
      console.log(`  [SKIP] No se encontro diccionario para ${locale}`);
      continue;
    }

    console.log(`  Procesando locale: ${locale.toUpperCase()}`);

    for (const sectionKey of SECTIONS) {
      const content = dictionary[sectionKey];
      if (!content) {
        console.log(`    [SKIP] Seccion "${sectionKey}" no existe en ${locale}`);
        continue;
      }

      try {
        // Verificar si existe
        const existing = await prisma.sectionContent.findUnique({
          where: {
            sectionKey_locale: {
              sectionKey,
              locale,
            },
          },
        });

        // Upsert: crear o actualizar
        await prisma.sectionContent.upsert({
          where: {
            sectionKey_locale: {
              sectionKey,
              locale,
            },
          },
          update: {
            content: content as object,
            isActive: true,
          },
          create: {
            sectionKey,
            locale,
            content: content as object,
            isActive: true,
          },
        });

        if (existing) {
          updated++;
          console.log(`    [UPDATE] ${sectionKey} (${locale})`);
        } else {
          created++;
          console.log(`    [CREATE] ${sectionKey} (${locale})`);
        }
      } catch (error) {
        errors++;
        console.error(`    [ERROR] ${sectionKey} (${locale}):`, error);
      }
    }
  }

  console.log("\n--- Resumen Contenido ---");
  console.log(`  Creados: ${created}`);
  console.log(`  Actualizados: ${updated}`);
  console.log(`  Errores: ${errors}`);
  console.log(`  Total procesados: ${created + updated}`);
}

// Ejecutar si se llama directamente
if (require.main === module) {
  seedContent()
    .then(() => {
      console.log("\nSeed de contenido completado.");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Error en seed de contenido:", error);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
