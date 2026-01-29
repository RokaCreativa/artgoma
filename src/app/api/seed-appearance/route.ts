// 🧭 MIGA DE PAN: Seed Appearance API - Endpoint temporal para seed en producción
// ⚠️ ELIMINAR DESPUÉS DE USAR
// 📋 SPEC: SPEC-26-01-2026-CMS-ContentManager

import { NextResponse } from "next/server";
import prisma from "@/lib/db";

const APPEARANCE_CONFIGS = [
  { key: "bg_primary", value: "#1c1f24", type: "color", group: "appearance", label: "Color Fondo Principal" },
  { key: "bg_surface", value: "#2a2d35", type: "color", group: "appearance", label: "Color Superficies" },
  { key: "bg_input", value: "#0f1115", type: "color", group: "appearance", label: "Color Inputs" },
  { key: "accent_color", value: "#dc2626", type: "color", group: "appearance", label: "Color Acento" },
  { key: "bg_footer", value: "#000000", type: "color", group: "appearance", label: "Color Footer" },
  { key: "font_display", value: "Cormorant Garamond", type: "select", group: "appearance", label: "Fuente Títulos" },
  { key: "font_body", value: "Montserrat", type: "select", group: "appearance", label: "Fuente Textos" },
];

export async function GET() {
  try {
    let created = 0;
    let updated = 0;

    for (const config of APPEARANCE_CONFIGS) {
      const existing = await prisma.siteConfig.findUnique({
        where: { key: config.key },
      });

      await prisma.siteConfig.upsert({
        where: { key: config.key },
        update: config,
        create: config,
      });

      if (existing) {
        updated++;
      } else {
        created++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Appearance configs seeded: ${created} created, ${updated} updated`,
      total: APPEARANCE_CONFIGS.length
    });
  } catch (error) {
    console.error('[seed-appearance] Error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
