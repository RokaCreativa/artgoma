// 🧭 MIGA DE PAN: Content Server Actions - CRUD para contenido multiidioma del CMS
// 📍 UBICACIÓN: src/actions/cms/content.ts
// 🎯 PORQUÉ EXISTE: Gestionar textos de secciones en múltiples idiomas desde el panel admin
// 🔄 FLUJO: Admin UI → Server Action → Prisma → BD
// 🚨 CUIDADO: Todas las acciones de escritura deben validar autenticación
// 📋 SPEC: SPEC-26-01-2026-CMS-ContentManager
// 🔗 RELATED: tasks.md → 2.1, spec.md → REQ-03

"use server";

import prisma from "@/lib/db";
import { revalidatePath, revalidateTag } from "next/cache";
import { isAdminAuthenticated } from "@/lib/cms/auth";
import { z } from "zod";
import type { Prisma } from "@prisma/client";
import { VALID_SECTIONS, VALID_LOCALES } from "@/lib/cms/contentConstants";

// ============================================
// SCHEMAS DE VALIDACIÓN
// ============================================

const SectionKeySchema = z.enum(VALID_SECTIONS, {
  errorMap: () => ({ message: "Sección no válida" }),
});

const LocaleSchema = z.enum(VALID_LOCALES, {
  errorMap: () => ({ message: "Idioma no válido" }),
});

/**
 * Schema para el contenido JSON
 * Estructura flexible que permite cualquier objeto JSON válido
 * La estructura específica se valida según la sección en el frontend
 */
const ContentSchema = z
  .record(z.unknown())
  .refine((obj) => Object.keys(obj).length > 0, {
    message: "El contenido no puede estar vacío",
  });

const UpsertSectionContentSchema = z.object({
  sectionKey: SectionKeySchema,
  locale: LocaleSchema,
  content: ContentSchema,
  isActive: z.boolean().default(true),
});

const DeleteSectionContentSchema = z.object({
  id: z.number().int().positive("ID inválido"),
});

// ============================================
// TIPOS (Re-exportados desde contentConstants para compatibilidad)
// ============================================

// Nota: Los tipos base SectionKey y Locale están en @/lib/cms/contentConstants
import type { SectionKey, Locale } from "@/lib/cms/contentConstants";

// Tipos adicionales usados en las funciones de este archivo
type SectionWithLocales = {
  sectionKey: SectionKey;
  locales: Locale[];
  totalLocales: number;
};

// ============================================
// QUERIES (Lectura - No requieren auth)
// ============================================

/**
 * Obtiene el contenido de una sección para un idioma específico
 * @param sectionKey - Key de la sección (hero, connect, etc.)
 * @param locale - Código de idioma (es, en, de, etc.)
 * @returns El contenido de la sección o null si no existe
 */
export async function getSectionContent(
  sectionKey: string,
  locale: string,
): Promise<{
  success: boolean;
  data?: {
    id: number;
    sectionKey: string;
    locale: string;
    content: Prisma.JsonValue;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  } | null;
  error?: string;
}> {
  try {
    // Validar inputs
    const validatedSection = SectionKeySchema.safeParse(sectionKey);
    const validatedLocale = LocaleSchema.safeParse(locale);

    if (!validatedSection.success) {
      return {
        success: false,
        error: validatedSection.error.errors[0].message,
      };
    }
    if (!validatedLocale.success) {
      return { success: false, error: validatedLocale.error.errors[0].message };
    }

    const content = await prisma.sectionContent.findUnique({
      where: {
        sectionKey_locale: {
          sectionKey: validatedSection.data,
          locale: validatedLocale.data,
        },
      },
    });

    return { success: true, data: content };
  } catch (error) {
    console.error("[getSectionContent] Error:", error);
    return {
      success: false,
      error: "Error al obtener contenido de la sección",
    };
  }
}

/**
 * Obtiene todos los contenidos de una sección (todos los idiomas)
 * @param sectionKey - Key de la sección
 * @returns Array de contenidos por idioma
 */
export async function getSectionContentAllLocales(sectionKey: string): Promise<{
  success: boolean;
  data?: Array<{
    id: number;
    sectionKey: string;
    locale: string;
    content: Prisma.JsonValue;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }>;
  error?: string;
}> {
  try {
    const validatedSection = SectionKeySchema.safeParse(sectionKey);
    if (!validatedSection.success) {
      return {
        success: false,
        error: validatedSection.error.errors[0].message,
      };
    }

    const contents = await prisma.sectionContent.findMany({
      where: {
        sectionKey: validatedSection.data,
      },
      orderBy: {
        locale: "asc",
      },
    });

    return { success: true, data: contents };
  } catch (error) {
    console.error("[getSectionContentAllLocales] Error:", error);
    return {
      success: false,
      error: "Error al obtener contenidos de la sección",
    };
  }
}

/**
 * Lista todas las secciones disponibles con sus idiomas configurados
 * @returns Lista de secciones con metadatos
 */
export async function getAllSections(): Promise<{
  success: boolean;
  data?: SectionWithLocales[];
  error?: string;
}> {
  try {
    // Obtener todas las entradas agrupadas por sección
    const contents = await prisma.sectionContent.findMany({
      select: {
        sectionKey: true,
        locale: true,
      },
      orderBy: [{ sectionKey: "asc" }, { locale: "asc" }],
    });

    // Agrupar por sección
    const sectionsMap = new Map<string, Set<string>>();

    for (const content of contents) {
      if (!sectionsMap.has(content.sectionKey)) {
        sectionsMap.set(content.sectionKey, new Set());
      }
      sectionsMap.get(content.sectionKey)!.add(content.locale);
    }

    // Incluir todas las secciones válidas, incluso las que no tienen contenido aún
    const result: SectionWithLocales[] = VALID_SECTIONS.map((sectionKey) => {
      const locales = sectionsMap.get(sectionKey);
      return {
        sectionKey,
        locales: locales ? (Array.from(locales) as Locale[]) : [],
        totalLocales: locales ? locales.size : 0,
      };
    });

    return { success: true, data: result };
  } catch (error) {
    console.error("[getAllSections] Error:", error);
    return { success: false, error: "Error al obtener lista de secciones" };
  }
}

/**
 * Obtiene el contenido de múltiples secciones para un idioma
 * Útil para cargar todo el contenido de una página de una vez
 * @param sectionKeys - Array de keys de secciones
 * @param locale - Código de idioma
 * @returns Mapa de sectionKey -> contenido
 */
export async function getMultipleSections(
  sectionKeys: string[],
  locale: string,
): Promise<{
  success: boolean;
  data?: Record<string, Prisma.JsonValue | null>;
  error?: string;
}> {
  try {
    const validatedLocale = LocaleSchema.safeParse(locale);
    if (!validatedLocale.success) {
      return { success: false, error: validatedLocale.error.errors[0].message };
    }

    // Validar todas las secciones
    const validKeys: SectionKey[] = [];
    for (const key of sectionKeys) {
      const validated = SectionKeySchema.safeParse(key);
      if (validated.success) {
        validKeys.push(validated.data);
      }
    }

    if (validKeys.length === 0) {
      return {
        success: false,
        error: "No se proporcionaron secciones válidas",
      };
    }

    const contents = await prisma.sectionContent.findMany({
      where: {
        sectionKey: { in: validKeys },
        locale: validatedLocale.data,
        isActive: true,
      },
    });

    // Crear mapa de resultados
    const result: Record<string, Prisma.JsonValue | null> = {};
    for (const key of validKeys) {
      const found = contents.find((c) => c.sectionKey === key);
      result[key] = found?.content ?? null;
    }

    return { success: true, data: result };
  } catch (error) {
    console.error("[getMultipleSections] Error:", error);
    return { success: false, error: "Error al obtener contenidos" };
  }
}

// ============================================
// MUTATIONS (Escritura - Requieren auth)
// ============================================

/**
 * Crea o actualiza el contenido de una sección para un idioma
 * Si ya existe, lo actualiza (upsert)
 * @param sectionKey - Key de la sección
 * @param locale - Código de idioma
 * @param content - Objeto JSON con el contenido
 * @returns El contenido creado/actualizado
 */
export async function upsertSectionContent(
  sectionKey: string,
  locale: string,
  content: Record<string, unknown>,
): Promise<{
  success: boolean;
  data?: {
    id: number;
    sectionKey: string;
    locale: string;
    content: Prisma.JsonValue;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  };
  error?: string;
}> {
  // Verificar autenticación
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return { success: false, error: "No autorizado" };
  }

  try {
    // Validar inputs
    const validated = UpsertSectionContentSchema.safeParse({
      sectionKey,
      locale,
      content,
    });

    if (!validated.success) {
      return { success: false, error: validated.error.errors[0].message };
    }

    const {
      sectionKey: validatedSection,
      locale: validatedLocale,
      content: validatedContent,
    } = validated.data;

    // Upsert: crear si no existe, actualizar si existe
    const result = await prisma.sectionContent.upsert({
      where: {
        sectionKey_locale: {
          sectionKey: validatedSection,
          locale: validatedLocale,
        },
      },
      update: {
        content: validatedContent as Prisma.InputJsonValue,
        updatedAt: new Date(),
      },
      create: {
        sectionKey: validatedSection,
        locale: validatedLocale,
        content: validatedContent as Prisma.InputJsonValue,
        isActive: true,
      },
    });

    // Revalidar cache - TODOS los tags relacionados con contenido
    revalidateTag("cms-content", "max");
    revalidateTag("section-content", "max");
    revalidateTag("dictionary", "max");
    revalidatePath("/admin/content");
    revalidatePath(`/${validatedLocale}`); // Revalidar página del idioma

    return { success: true, data: result };
  } catch (error) {
    console.error("[upsertSectionContent] Error:", error);
    return {
      success: false,
      error: "Error al guardar contenido de la sección",
    };
  }
}

/**
 * Elimina el contenido de una sección específica por ID
 * @param id - ID del registro a eliminar
 * @returns Resultado de la operación
 */
export async function deleteSectionContent(id: number): Promise<{
  success: boolean;
  data?: { deletedId: number; sectionKey: string; locale: string };
  error?: string;
}> {
  // Verificar autenticación
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return { success: false, error: "No autorizado" };
  }

  try {
    // Validar ID
    const validated = DeleteSectionContentSchema.safeParse({ id });
    if (!validated.success) {
      return { success: false, error: validated.error.errors[0].message };
    }

    // Verificar que existe antes de eliminar
    const existing = await prisma.sectionContent.findUnique({
      where: { id: validated.data.id },
    });

    if (!existing) {
      return { success: false, error: "Contenido no encontrado" };
    }

    // Eliminar
    await prisma.sectionContent.delete({
      where: { id: validated.data.id },
    });

    // Revalidar cache - TODOS los tags relacionados con contenido
    revalidateTag("cms-content", "max");
    revalidateTag("section-content", "max");
    revalidateTag("dictionary", "max");
    revalidatePath("/admin/content");
    revalidatePath(`/${existing.locale}`);

    return {
      success: true,
      data: {
        deletedId: existing.id,
        sectionKey: existing.sectionKey,
        locale: existing.locale,
      },
    };
  } catch (error) {
    console.error("[deleteSectionContent] Error:", error);
    return { success: false, error: "Error al eliminar contenido" };
  }
}

/**
 * Toggle activo/inactivo de un contenido
 * @param id - ID del registro
 * @returns El registro actualizado
 */
export async function toggleSectionContentActive(id: number): Promise<{
  success: boolean;
  data?: {
    id: number;
    sectionKey: string;
    locale: string;
    isActive: boolean;
  };
  error?: string;
}> {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return { success: false, error: "No autorizado" };
  }

  try {
    const existing = await prisma.sectionContent.findUnique({
      where: { id },
    });

    if (!existing) {
      return { success: false, error: "Contenido no encontrado" };
    }

    const updated = await prisma.sectionContent.update({
      where: { id },
      data: { isActive: !existing.isActive },
      select: {
        id: true,
        sectionKey: true,
        locale: true,
        isActive: true,
      },
    });

    // Revalidar cache - TODOS los tags relacionados con contenido
    revalidateTag("cms-content", "max");
    revalidateTag("section-content", "max");
    revalidateTag("dictionary", "max");
    revalidatePath("/admin/content");
    revalidatePath(`/${existing.locale}`);

    return { success: true, data: updated };
  } catch (error) {
    console.error("[toggleSectionContentActive] Error:", error);
    return { success: false, error: "Error al cambiar estado" };
  }
}

/**
 * Auto-traduce contenido de una sección usando IA (GPT-4o-mini)
 * Solo traduce campos vacíos, preserva contenido existente
 * @param sectionKey - Key de la sección
 * @param sourceLocale - Idioma origen (normalmente 'es')
 * @param targetLocale - Idioma destino
 * @returns Resultado con campos traducidos y costo estimado
 */
export async function autoTranslateSectionContent(
  sectionKey: string,
  sourceLocale: string,
  targetLocale: string,
): Promise<{
  success: boolean;
  data?: {
    fieldsTranslated: number;
    totalFields: number;
    cost: string;
    content: Prisma.JsonValue;
  };
  error?: string;
}> {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return { success: false, error: "No autorizado" };
  }

  try {
    // Validar inputs
    const validatedSection = SectionKeySchema.safeParse(sectionKey);
    const validatedSourceLocale = LocaleSchema.safeParse(sourceLocale);
    const validatedTargetLocale = LocaleSchema.safeParse(targetLocale);

    if (!validatedSection.success) {
      return { success: false, error: validatedSection.error.errors[0].message };
    }
    if (!validatedSourceLocale.success) {
      return { success: false, error: `Idioma origen: ${validatedSourceLocale.error.errors[0].message}` };
    }
    if (!validatedTargetLocale.success) {
      return { success: false, error: `Idioma destino: ${validatedTargetLocale.error.errors[0].message}` };
    }

    if (validatedSourceLocale.data === validatedTargetLocale.data) {
      return { success: false, error: "Los idiomas origen y destino deben ser diferentes" };
    }

    // Verificar que OPENAI_API_KEY existe
    const openaiKey = process.env.OPENAI_API_KEY;
    if (!openaiKey) {
      return {
        success: false,
        error: "OPENAI_API_KEY no configurada. Añade la variable de entorno para usar auto-traducción."
      };
    }

    // Obtener contenido origen
    const source = await prisma.sectionContent.findUnique({
      where: {
        sectionKey_locale: {
          sectionKey: validatedSection.data,
          locale: validatedSourceLocale.data,
        },
      },
    });

    if (!source) {
      return { success: false, error: `No existe contenido en ${sourceLocale} para esta sección` };
    }

    // Obtener contenido destino existente (para preservar campos ya traducidos)
    const target = await prisma.sectionContent.findUnique({
      where: {
        sectionKey_locale: {
          sectionKey: validatedSection.data,
          locale: validatedTargetLocale.data,
        },
      },
    });

    const sourceContent = source.content as Record<string, unknown>;
    const targetContent = (target?.content as Record<string, unknown>) || {};

    // Identificar campos que necesitan traducción (vacíos o inexistentes en target)
    const fieldsToTranslate: Record<string, unknown> = {};
    const fieldsAlreadyTranslated: Record<string, unknown> = {};

    function collectFieldsToTranslate(
      srcObj: Record<string, unknown>,
      tgtObj: Record<string, unknown>,
      toTranslate: Record<string, unknown>,
      alreadyDone: Record<string, unknown>,
      path: string = ""
    ) {
      for (const key of Object.keys(srcObj)) {
        const srcValue = srcObj[key];
        const tgtValue = tgtObj[key];
        const currentPath = path ? `${path}.${key}` : key;

        if (typeof srcValue === "object" && srcValue !== null && !Array.isArray(srcValue)) {
          // Recursión para objetos anidados
          const nestedToTranslate: Record<string, unknown> = {};
          const nestedAlreadyDone: Record<string, unknown> = {};
          collectFieldsToTranslate(
            srcValue as Record<string, unknown>,
            (tgtValue as Record<string, unknown>) || {},
            nestedToTranslate,
            nestedAlreadyDone,
            currentPath
          );
          if (Object.keys(nestedToTranslate).length > 0) {
            toTranslate[key] = nestedToTranslate;
          }
          if (Object.keys(nestedAlreadyDone).length > 0) {
            alreadyDone[key] = nestedAlreadyDone;
          }
        } else if (Array.isArray(srcValue)) {
          // Arrays: traducir si target está vacío o no existe
          if (!tgtValue || (Array.isArray(tgtValue) && tgtValue.length === 0)) {
            toTranslate[key] = srcValue;
          } else {
            alreadyDone[key] = tgtValue;
          }
        } else {
          // Valores primitivos: traducir si target está vacío
          const tgtStr = typeof tgtValue === "string" ? tgtValue.trim() : "";
          if (!tgtStr) {
            toTranslate[key] = srcValue;
          } else {
            alreadyDone[key] = tgtValue;
          }
        }
      }
    }

    collectFieldsToTranslate(sourceContent, targetContent, fieldsToTranslate, fieldsAlreadyTranslated);

    // Contar campos a traducir
    function countFields(obj: Record<string, unknown>): number {
      let count = 0;
      for (const value of Object.values(obj)) {
        if (typeof value === "object" && value !== null && !Array.isArray(value)) {
          count += countFields(value as Record<string, unknown>);
        } else {
          count += 1;
        }
      }
      return count;
    }

    const fieldsToTranslateCount = countFields(fieldsToTranslate);
    const totalFields = countFields(sourceContent);

    if (fieldsToTranslateCount === 0) {
      return {
        success: true,
        data: {
          fieldsTranslated: 0,
          totalFields,
          cost: "$0.00",
          content: targetContent as unknown as Prisma.JsonValue,
        },
      };
    }

    // Mapeo de códigos de idioma a nombres legibles
    const LANGUAGE_NAMES: Record<string, string> = {
      es: "Spanish",
      en: "English",
      de: "German",
      fr: "French",
      it: "Italian",
      ru: "Russian",
    };

    const sourceLangName = LANGUAGE_NAMES[validatedSourceLocale.data] || validatedSourceLocale.data;
    const targetLangName = LANGUAGE_NAMES[validatedTargetLocale.data] || validatedTargetLocale.data;

    // Llamar a OpenAI para traducir
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openaiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are a professional translator. Translate the following JSON content from ${sourceLangName} to ${targetLangName}.
IMPORTANT RULES:
1. Preserve the exact JSON structure and keys
2. Only translate the string VALUES, never the keys
3. Keep arrays as arrays with translated items
4. Maintain any special characters, HTML entities, or formatting
5. Return ONLY valid JSON, no explanations or markdown
6. For proper nouns (names, brands), keep them unchanged unless they have an official translation`,
          },
          {
            role: "user",
            content: JSON.stringify(fieldsToTranslate, null, 2),
          },
        ],
        temperature: 0.3,
        max_tokens: 4096,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("[autoTranslateSectionContent] OpenAI error:", errorData);
      return { success: false, error: "Error al conectar con servicio de traducción" };
    }

    const data = await response.json();
    const translatedText = data.choices?.[0]?.message?.content;

    if (!translatedText) {
      return { success: false, error: "No se recibió respuesta del servicio de traducción" };
    }

    // Parsear respuesta JSON
    let translatedFields: Record<string, unknown>;
    try {
      // Limpiar posibles backticks de markdown
      const cleanJson = translatedText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      translatedFields = JSON.parse(cleanJson);
    } catch {
      console.error("[autoTranslateSectionContent] JSON parse error:", translatedText);
      return { success: false, error: "Error al procesar respuesta de traducción" };
    }

    // Merge: contenido existente + traducido
    function deepMerge(
      existing: Record<string, unknown>,
      translated: Record<string, unknown>
    ): Record<string, unknown> {
      const result = { ...existing };
      for (const key of Object.keys(translated)) {
        const translatedValue = translated[key];
        if (typeof translatedValue === "object" && translatedValue !== null && !Array.isArray(translatedValue)) {
          result[key] = deepMerge(
            (result[key] as Record<string, unknown>) || {},
            translatedValue as Record<string, unknown>
          );
        } else {
          result[key] = translatedValue;
        }
      }
      return result;
    }

    const mergedContent = deepMerge(targetContent, translatedFields);

    // Guardar en BD
    await prisma.sectionContent.upsert({
      where: {
        sectionKey_locale: {
          sectionKey: validatedSection.data,
          locale: validatedTargetLocale.data,
        },
      },
      update: {
        content: mergedContent as Prisma.InputJsonValue,
        updatedAt: new Date(),
      },
      create: {
        sectionKey: validatedSection.data,
        locale: validatedTargetLocale.data,
        content: mergedContent as Prisma.InputJsonValue,
        isActive: true,
      },
    });

    // Revalidar cache
    revalidateTag("cms-content", "max");
    revalidateTag("section-content", "max");
    revalidateTag("dictionary", "max");
    revalidatePath("/admin/content");
    revalidatePath(`/${validatedTargetLocale.data}`);

    // Estimar costo (GPT-4o-mini: $0.15 input, $0.60 output per 1M tokens)
    const inputTokens = data.usage?.prompt_tokens || 0;
    const outputTokens = data.usage?.completion_tokens || 0;
    const cost = ((inputTokens * 0.15 + outputTokens * 0.6) / 1_000_000).toFixed(4);

    return {
      success: true,
      data: {
        fieldsTranslated: fieldsToTranslateCount,
        totalFields,
        cost: `$${cost}`,
        content: mergedContent as unknown as Prisma.JsonValue,
      },
    };
  } catch (error) {
    console.error("[autoTranslateSectionContent] Error:", error);
    return { success: false, error: "Error al auto-traducir contenido" };
  }
}

/**
 * Copia contenido de un idioma a otro
 * Útil para crear traducciones partiendo de un idioma base
 * @param sectionKey - Key de la sección
 * @param fromLocale - Idioma origen
 * @param toLocale - Idioma destino
 * @returns El contenido copiado
 */
export async function copySectionContentToLocale(
  sectionKey: string,
  fromLocale: string,
  toLocale: string,
): Promise<{
  success: boolean;
  data?: {
    id: number;
    sectionKey: string;
    locale: string;
    content: Prisma.JsonValue;
  };
  error?: string;
}> {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return { success: false, error: "No autorizado" };
  }

  try {
    // Validar inputs
    const validatedSection = SectionKeySchema.safeParse(sectionKey);
    const validatedFromLocale = LocaleSchema.safeParse(fromLocale);
    const validatedToLocale = LocaleSchema.safeParse(toLocale);

    if (!validatedSection.success) {
      return {
        success: false,
        error: validatedSection.error.errors[0].message,
      };
    }
    if (!validatedFromLocale.success) {
      return {
        success: false,
        error: `Idioma origen: ${validatedFromLocale.error.errors[0].message}`,
      };
    }
    if (!validatedToLocale.success) {
      return {
        success: false,
        error: `Idioma destino: ${validatedToLocale.error.errors[0].message}`,
      };
    }

    if (validatedFromLocale.data === validatedToLocale.data) {
      return {
        success: false,
        error: "Los idiomas origen y destino deben ser diferentes",
      };
    }

    // Obtener contenido origen
    const source = await prisma.sectionContent.findUnique({
      where: {
        sectionKey_locale: {
          sectionKey: validatedSection.data,
          locale: validatedFromLocale.data,
        },
      },
    });

    if (!source) {
      return {
        success: false,
        error: `No existe contenido en ${fromLocale} para esta sección`,
      };
    }

    // Crear o actualizar en idioma destino
    const result = await prisma.sectionContent.upsert({
      where: {
        sectionKey_locale: {
          sectionKey: validatedSection.data,
          locale: validatedToLocale.data,
        },
      },
      update: {
        content: source.content as Prisma.InputJsonValue,
        updatedAt: new Date(),
      },
      create: {
        sectionKey: validatedSection.data,
        locale: validatedToLocale.data,
        content: source.content as Prisma.InputJsonValue,
        isActive: true,
      },
      select: {
        id: true,
        sectionKey: true,
        locale: true,
        content: true,
      },
    });

    // Revalidar cache - TODOS los tags relacionados con contenido
    revalidateTag("cms-content", "max");
    revalidateTag("section-content", "max");
    revalidateTag("dictionary", "max");
    revalidatePath("/admin/content");
    revalidatePath(`/${validatedToLocale.data}`);

    return { success: true, data: result };
  } catch (error) {
    console.error("[copySectionContentToLocale] Error:", error);
    return { success: false, error: "Error al copiar contenido" };
  }
}
