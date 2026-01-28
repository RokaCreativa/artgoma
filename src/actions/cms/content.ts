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
    revalidateTag("cms-content");
    revalidateTag("section-content");
    revalidateTag("dictionary");
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
    revalidateTag("cms-content");
    revalidateTag("section-content");
    revalidateTag("dictionary");
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
    revalidateTag("cms-content");
    revalidateTag("section-content");
    revalidateTag("dictionary");
    revalidatePath("/admin/content");
    revalidatePath(`/${existing.locale}`);

    return { success: true, data: updated };
  } catch (error) {
    console.error("[toggleSectionContentActive] Error:", error);
    return { success: false, error: "Error al cambiar estado" };
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
    revalidateTag("cms-content");
    revalidateTag("section-content");
    revalidateTag("dictionary");
    revalidatePath("/admin/content");
    revalidatePath(`/${validatedToLocale.data}`);

    return { success: true, data: result };
  } catch (error) {
    console.error("[copySectionContentToLocale] Error:", error);
    return { success: false, error: "Error al copiar contenido" };
  }
}
