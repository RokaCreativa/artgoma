/**
 * SEED: Configuracion del Sitio (SiteConfig)
 * SPEC: SPEC-26-01-2026-CMS-ContentManager
 *
 * Inserta configuraciones iniciales para contacto, redes sociales y footer.
 * Valores extraidos de componentes hardcodeados (Footer.tsx, etc.)
 * Usa upsert para ser idempotente.
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Configuraciones a insertar
const CONFIGS = [
  // === CONTACTO ===
  {
    key: "phone",
    value: "+34 922 123 456",
    type: "phone",
    group: "contact",
    label: "Telefono",
  },
  {
    key: "email",
    value: "info@artgoma.com",
    type: "email",
    group: "contact",
    label: "Email",
  },
  {
    key: "address",
    value: "Calle del Arte 123, Santa Cruz de Tenerife, Islas Canarias",
    type: "text",
    group: "contact",
    label: "Direccion",
  },
  {
    key: "whatsapp",
    value: "+34 600 123 456",
    type: "phone",
    group: "contact",
    label: "WhatsApp",
  },

  // === REDES SOCIALES ===
  {
    key: "facebook",
    value: "https://www.facebook.com/theartgomagallery",
    type: "url",
    group: "social",
    label: "Facebook",
  },
  {
    key: "instagram",
    value: "https://www.instagram.com/theartgomagallery",
    type: "url",
    group: "social",
    label: "Instagram",
  },
  {
    key: "youtube",
    value: "https://www.youtube.com/@ArtGoMA",
    type: "url",
    group: "social",
    label: "YouTube",
  },
  {
    key: "twitter",
    value: "",
    type: "url",
    group: "social",
    label: "Twitter/X",
  },

  // === FOOTER ===
  {
    key: "copyright",
    value: "GOMA ALL RIGHTS RESERVED",
    type: "text",
    group: "footer",
    label: "Copyright",
  },
  {
    key: "year",
    value: "2026",
    type: "text",
    group: "footer",
    label: "Ano",
  },
  {
    key: "website",
    value: "WWW.ARTGOMA.COM",
    type: "text",
    group: "footer",
    label: "Website",
  },

  // === APPEARANCE (Colores + Fonts) ===
  {
    key: "bg_primary",
    value: "#1c1f24",
    type: "color",
    group: "appearance",
    label: "Color Fondo Principal",
  },
  {
    key: "bg_surface",
    value: "#2a2d35",
    type: "color",
    group: "appearance",
    label: "Color Superficies/Cards",
  },
  {
    key: "bg_input",
    value: "#0f1115",
    type: "color",
    group: "appearance",
    label: "Color Fondo Inputs",
  },
  {
    key: "accent_color",
    value: "#dc2626",
    type: "color",
    group: "appearance",
    label: "Color de Acento (Rojo)",
  },
  {
    key: "bg_footer",
    value: "#000000",
    type: "color",
    group: "appearance",
    label: "Color Fondo Footer",
  },
  {
    key: "font_display",
    value: "Cormorant Garamond",
    type: "select",
    group: "appearance",
    label: "Tipografia Titulos",
  },
  {
    key: "font_body",
    value: "Montserrat",
    type: "select",
    group: "appearance",
    label: "Tipografia Cuerpo",
  },
  {
    key: "connect_image",
    value: "/banana.avif",
    type: "url",
    group: "appearance",
    label: "Imagen Seccion Conecte",
  },
  {
    key: "connect_pattern",
    value: "/paterngoma.png",
    type: "url",
    group: "appearance",
    label: "Pattern Fondo Conecte",
  },
];

/**
 * Seed de configuracion del sitio
 */
export async function seedConfig(): Promise<void> {
  console.log("\n--- SEED: Configuracion del Sitio ---\n");

  let created = 0;
  let updated = 0;
  let errors = 0;

  for (const config of CONFIGS) {
    try {
      // Verificar si existe
      const existing = await prisma.siteConfig.findUnique({
        where: { key: config.key },
      });

      // Upsert: crear o actualizar
      await prisma.siteConfig.upsert({
        where: { key: config.key },
        update: {
          value: config.value,
          type: config.type,
          group: config.group,
          label: config.label,
        },
        create: {
          key: config.key,
          value: config.value,
          type: config.type,
          group: config.group,
          label: config.label,
        },
      });

      if (existing) {
        updated++;
        console.log(`  [UPDATE] ${config.group}/${config.key}: ${config.value || "(vacio)"}`);
      } else {
        created++;
        console.log(`  [CREATE] ${config.group}/${config.key}: ${config.value || "(vacio)"}`);
      }
    } catch (error) {
      errors++;
      console.error(`  [ERROR] ${config.key}:`, error);
    }
  }

  console.log("\n--- Resumen Config ---");
  console.log(`  Creados: ${created}`);
  console.log(`  Actualizados: ${updated}`);
  console.log(`  Errores: ${errors}`);
  console.log(`  Total: ${CONFIGS.length}`);
}

// Ejecutar si se llama directamente
if (require.main === module) {
  seedConfig()
    .then(() => {
      console.log("\nSeed de config completado.");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Error en seed de config:", error);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
