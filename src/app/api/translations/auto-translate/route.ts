// 🧭 MIGA DE PAN: API Auto-Translate - Endpoint para auto-traduccion con GPT-4o-mini
// 📍 UBICACION: src/app/api/translations/auto-translate/route.ts
//
// 🎯 PORQUE EXISTE: Traducir automaticamente contenido de secciones de ES a otros idiomas
// 🎯 CASOS DE USO:
//   1. Admin quiere traducir seccion "home" de ES a EN
//   2. Admin quiere traducir TODAS las secciones a un idioma
//   3. Detectar que campos faltan en un idioma
//
// 🔄 FLUJO: Admin UI -> POST /api/translations/auto-translate -> GPT-4o-mini -> upsertSectionContent
// 🔗 USADO EN: Panel admin de contenido, futuro boton "Auto-traducir"
// ⚠️ DEPENDENCIAS: translateContent.ts, content.ts actions
//
// 🚨 CUIDADO: Requiere auth, no sobrescribir traducciones manuales
// 📋 SPEC: SPEC-26-01-2026-CMS-ContentManager (Mission 06)

import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/cms/auth";
import {
  translateSectionContent,
  detectMissingFields,
  getTranslationStats,
} from "@/lib/cms/translateContent";
import { getSectionContentNoCache } from "@/queries/cms/getSectionContent";
import prisma from "@/lib/db";
import { revalidateTag, revalidatePath } from "next/cache";
import { VALID_SECTIONS, VALID_LOCALES } from "@/lib/cms/contentConstants";
import type { Prisma } from "@prisma/client";

// ============================================
// CONFIGURACION
// ============================================

const SOURCE_LOCALE = "es"; // Idioma fuente (source of truth)

// ============================================
// TIPOS
// ============================================

interface AutoTranslateRequest {
  sectionKey: string; // Seccion a traducir (o "all" para todas)
  targetLocale: string; // Idioma destino
  sourceLocale?: string; // Idioma fuente (default: "es")
  overwrite?: boolean; // Sobrescribir traducciones existentes (default: false)
  dryRun?: boolean; // Solo calcular, no guardar (default: false)
}

interface TranslationStat {
  sectionKey: string;
  targetLocale: string;
  totalFields: number;
  missingFields: number;
  percentage: number;
}

// ============================================
// POST - Ejecutar auto-traduccion
// ============================================

export async function POST(request: NextRequest): Promise<NextResponse> {
  console.log("[auto-translate] POST recibido");

  // 🔒 Verificar autenticacion
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const body: AutoTranslateRequest = await request.json();
    const {
      sectionKey,
      targetLocale,
      sourceLocale = SOURCE_LOCALE,
      overwrite = false,
      dryRun = false,
    } = body;

    console.log("[auto-translate] Request:", {
      sectionKey,
      targetLocale,
      sourceLocale,
      overwrite,
      dryRun,
    });

    // Validaciones
    if (!sectionKey) {
      return NextResponse.json(
        { error: "sectionKey es requerido" },
        { status: 400 }
      );
    }

    if (!targetLocale) {
      return NextResponse.json(
        { error: "targetLocale es requerido" },
        { status: 400 }
      );
    }

    // Validar locale destino
    if (!VALID_LOCALES.includes(targetLocale as (typeof VALID_LOCALES)[number])) {
      return NextResponse.json(
        { error: `Locale no valido: ${targetLocale}. Validos: ${VALID_LOCALES.join(", ")}` },
        { status: 400 }
      );
    }

    if (targetLocale === sourceLocale) {
      return NextResponse.json(
        { error: "El idioma destino debe ser diferente al origen" },
        { status: 400 }
      );
    }

    // Determinar secciones a traducir
    let sectionsToTranslate: string[];
    if (sectionKey === "all") {
      sectionsToTranslate = [...VALID_SECTIONS];
    } else {
      if (!VALID_SECTIONS.includes(sectionKey as (typeof VALID_SECTIONS)[number])) {
        return NextResponse.json(
          { error: `Seccion no valida: ${sectionKey}. Validas: ${VALID_SECTIONS.join(", ")}` },
          { status: 400 }
        );
      }
      sectionsToTranslate = [sectionKey];
    }

    // Resultados agregados
    const results: {
      sectionKey: string;
      success: boolean;
      fieldsTranslated: number;
      tokensUsed: number;
      cost: number;
      error?: string;
    }[] = [];

    let totalTokensUsed = 0;
    let totalFieldsTranslated = 0;
    let totalCost = 0;

    // Procesar cada seccion
    for (const section of sectionsToTranslate) {
      console.log(`[auto-translate] Procesando seccion: ${section}`);

      // Obtener contenido source (ES)
      const sourceContent = await getSectionContentNoCache(section, sourceLocale);

      if (!sourceContent) {
        console.log(`[auto-translate] Seccion ${section} no tiene contenido en ${sourceLocale}, saltando`);
        results.push({
          sectionKey: section,
          success: false,
          fieldsTranslated: 0,
          tokensUsed: 0,
          cost: 0,
          error: `No existe contenido en ${sourceLocale}`,
        });
        continue;
      }

      // Obtener contenido target existente (si existe)
      const existingContent = await getSectionContentNoCache(section, targetLocale);

      // Si dryRun, solo calcular sin traducir
      if (dryRun) {
        const missingFields = detectMissingFields(
          sourceContent as Record<string, unknown>,
          existingContent as Record<string, unknown> | null
        );
        results.push({
          sectionKey: section,
          success: true,
          fieldsTranslated: missingFields.length,
          tokensUsed: 0,
          cost: 0,
        });
        continue;
      }

      // Ejecutar traduccion
      const translationResult = await translateSectionContent(
        sourceContent as Record<string, unknown>,
        sourceLocale,
        targetLocale,
        overwrite ? null : (existingContent as Record<string, unknown> | null),
        { preserveExisting: !overwrite }
      );

      if (translationResult.success && translationResult.fieldsTranslated > 0) {
        // Guardar en BD usando upsert directo (no server action para evitar ciclos)
        await prisma.sectionContent.upsert({
          where: {
            sectionKey_locale: {
              sectionKey: section,
              locale: targetLocale,
            },
          },
          update: {
            content: translationResult.translatedContent as Prisma.InputJsonValue,
            updatedAt: new Date(),
          },
          create: {
            sectionKey: section,
            locale: targetLocale,
            content: translationResult.translatedContent as Prisma.InputJsonValue,
            isActive: true,
          },
        });

        console.log(`[auto-translate] Guardado ${section}/${targetLocale} con ${translationResult.fieldsTranslated} campos`);
      }

      totalTokensUsed += translationResult.tokensUsed;
      totalFieldsTranslated += translationResult.fieldsTranslated;
      totalCost += translationResult.estimatedCost;

      results.push({
        sectionKey: section,
        success: translationResult.success,
        fieldsTranslated: translationResult.fieldsTranslated,
        tokensUsed: translationResult.tokensUsed,
        cost: translationResult.estimatedCost,
        error: translationResult.errors.length > 0 ? translationResult.errors.join(", ") : undefined,
      });
    }

    // Invalidar cache si no es dryRun
    if (!dryRun && totalFieldsTranslated > 0) {
      revalidateTag("cms-content", "max");
      revalidateTag("section-content", "max");
      revalidateTag("dictionary", "max");
      revalidatePath("/admin/content");
      revalidatePath(`/${targetLocale}`);
    }

    // Respuesta
    return NextResponse.json({
      success: true,
      message: dryRun
        ? `Dry run completado: ${totalFieldsTranslated} campos pendientes de traducir`
        : `${totalFieldsTranslated} campos traducidos de ${sourceLocale} a ${targetLocale}`,
      data: {
        sectionsProcessed: results.length,
        totalFieldsTranslated,
        totalTokensUsed,
        estimatedCost: `$${totalCost.toFixed(6)}`,
        dryRun,
        results,
      },
    });
  } catch (error) {
    console.error("[auto-translate] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Error interno del servidor",
        details: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 }
    );
  }
}

// ============================================
// GET - Obtener estado de traducciones
// ============================================

export async function GET(request: NextRequest): Promise<NextResponse> {
  console.log("[auto-translate] GET recibido");

  // 🔒 Verificar autenticacion
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const targetLocale = searchParams.get("targetLocale");
    const sectionKey = searchParams.get("sectionKey");

    // Si no se especifica locale, retornar estado general
    if (!targetLocale) {
      // Obtener todas las combinaciones seccion/locale
      const allContent = await prisma.sectionContent.findMany({
        select: {
          sectionKey: true,
          locale: true,
        },
      });

      // Construir matriz de estado
      const statusMatrix: Record<string, Record<string, boolean>> = {};
      for (const section of VALID_SECTIONS) {
        statusMatrix[section] = {};
        for (const locale of VALID_LOCALES) {
          statusMatrix[section][locale] = allContent.some(
            (c) => c.sectionKey === section && c.locale === locale
          );
        }
      }

      return NextResponse.json({
        success: true,
        data: {
          sections: VALID_SECTIONS,
          locales: VALID_LOCALES,
          sourceLocale: SOURCE_LOCALE,
          statusMatrix,
        },
      });
    }

    // Validar locale
    if (!VALID_LOCALES.includes(targetLocale as (typeof VALID_LOCALES)[number])) {
      return NextResponse.json(
        { error: `Locale no valido: ${targetLocale}` },
        { status: 400 }
      );
    }

    // Obtener estadisticas para un locale especifico
    const stats: TranslationStat[] = [];
    const sectionsToCheck = sectionKey ? [sectionKey] : [...VALID_SECTIONS];

    for (const section of sectionsToCheck) {
      const sourceContent = await getSectionContentNoCache(section, SOURCE_LOCALE);
      const targetContent = await getSectionContentNoCache(section, targetLocale);

      if (sourceContent) {
        const sectionStats = getTranslationStats(
          sourceContent as Record<string, unknown>,
          targetContent as Record<string, unknown> | null
        );

        stats.push({
          sectionKey: section,
          targetLocale,
          totalFields: sectionStats.totalFields,
          missingFields: sectionStats.missingFields,
          percentage: sectionStats.percentage,
        });
      }
    }

    // Resumen
    const totalFields = stats.reduce((acc, s) => acc + s.totalFields, 0);
    const totalMissing = stats.reduce((acc, s) => acc + s.missingFields, 0);
    const overallPercentage =
      totalFields > 0
        ? Math.round(((totalFields - totalMissing) / totalFields) * 100)
        : 0;

    return NextResponse.json({
      success: true,
      data: {
        targetLocale,
        sourceLocale: SOURCE_LOCALE,
        sections: stats,
        summary: {
          totalFields,
          translatedFields: totalFields - totalMissing,
          missingFields: totalMissing,
          percentage: overallPercentage,
        },
      },
    });
  } catch (error) {
    console.error("[auto-translate GET] Error:", error);
    return NextResponse.json(
      { error: "Error obteniendo estadisticas" },
      { status: 500 }
    );
  }
}
