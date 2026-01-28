// 🧭 MIGA DE PAN: Config Server Actions - CRUD para configuración del sitio CMS
// 📍 UBICACIÓN: src/actions/cms/config.ts
// 🎯 PORQUÉ EXISTE: Gestionar config del sitio (contacto, redes, footer, meta) desde admin
// 🔄 FLUJO: Admin UI → Server Action → Prisma → BD → revalidateTag → Cache actualizado
// 🚨 CUIDADO: Las acciones de escritura (upsert, delete) requieren autenticación
// 📋 SPEC: SPEC-26-01-2026-CMS-ContentManager
// 🔗 RELATED: tasks.md → 3.1, spec.md → REQ-04

"use server";

import prisma from "@/lib/db";
import { revalidatePath, revalidateTag } from "next/cache";
import { isAdminAuthenticated } from "@/lib/cms/auth";
import { z } from "zod";
import { PREDEFINED_CONFIGS } from "@/lib/cms/configConstants";
import type { ISiteConfig, ConfigMap } from "@/lib/cms/configConstants";

// ============================================
// SCHEMAS DE VALIDACIÓN
// ============================================

const ConfigGroupSchema = z.enum(
  ["appearance", "contact", "social", "footer", "meta", "general"],
  {
    errorMap: () => ({ message: "Grupo no válido" }),
  },
);

const ConfigTypeSchema = z.enum(
  ["text", "url", "email", "phone", "image", "color", "select"],
  {
    errorMap: () => ({ message: "Tipo no válido" }),
  },
);

const ConfigKeySchema = z
  .string()
  .min(1, "La key es requerida")
  .max(50, "La key no puede exceder 50 caracteres")
  .regex(
    /^[a-z_]+$/,
    "La key solo puede contener letras minúsculas y guiones bajos",
  );

const ConfigValueSchema = z
  .string()
  .max(1000, "El valor no puede exceder 1000 caracteres");

const UpsertConfigSchema = z.object({
  key: ConfigKeySchema,
  value: ConfigValueSchema,
  type: ConfigTypeSchema.default("text"),
  group: ConfigGroupSchema.default("general"),
  label: z.string().max(100).optional().nullable(),
});

const DeleteConfigSchema = z.object({
  id: z.number().int().positive("ID inválido"),
});

// ============================================
// QUERIES (Lectura - No requieren auth)
// ============================================

/**
 * Obtiene todas las configuraciones de un grupo específico
 */
export async function getConfigByGroup(group: string): Promise<{
  success: boolean;
  data?: ISiteConfig[];
  error?: string;
}> {
  try {
    const validated = ConfigGroupSchema.safeParse(group);
    if (!validated.success) {
      return { success: false, error: validated.error.errors[0].message };
    }

    const configs = await prisma.siteConfig.findMany({
      where: {
        group: validated.data,
      },
      orderBy: {
        key: "asc",
      },
    });

    return { success: true, data: configs };
  } catch (error) {
    console.error("[getConfigByGroup] Error:", error);
    return {
      success: false,
      error: "Error al obtener configuraciones del grupo",
    };
  }
}

/**
 * Obtiene una configuración específica por su key
 */
export async function getConfigByKey(key: string): Promise<{
  success: boolean;
  data?: ISiteConfig | null;
  error?: string;
}> {
  try {
    const validated = ConfigKeySchema.safeParse(key);
    if (!validated.success) {
      return { success: false, error: validated.error.errors[0].message };
    }

    const config = await prisma.siteConfig.findUnique({
      where: {
        key: validated.data,
      },
    });

    return { success: true, data: config };
  } catch (error) {
    console.error("[getConfigByKey] Error:", error);
    return { success: false, error: "Error al obtener configuración" };
  }
}

/**
 * Obtiene todas las configuraciones del sitio
 */
export async function getAllConfigs(): Promise<{
  success: boolean;
  data?: ISiteConfig[];
  error?: string;
}> {
  try {
    const configs = await prisma.siteConfig.findMany({
      orderBy: [{ group: "asc" }, { key: "asc" }],
    });

    return { success: true, data: configs };
  } catch (error) {
    console.error("[getAllConfigs] Error:", error);
    return {
      success: false,
      error: "Error al obtener todas las configuraciones",
    };
  }
}

/**
 * Obtiene todas las configuraciones agrupadas por grupo
 */
export async function getAllConfigsGrouped(): Promise<{
  success: boolean;
  data?: Record<string, ISiteConfig[]>;
  error?: string;
}> {
  try {
    const configs = await prisma.siteConfig.findMany({
      orderBy: {
        key: "asc",
      },
    });

    const grouped: Record<string, ISiteConfig[]> = {};

    for (const config of configs) {
      if (!grouped[config.group]) {
        grouped[config.group] = [];
      }
      grouped[config.group].push(config);
    }

    return { success: true, data: grouped };
  } catch (error) {
    console.error("[getAllConfigsGrouped] Error:", error);
    return {
      success: false,
      error: "Error al obtener configuraciones agrupadas",
    };
  }
}

/**
 * Obtiene múltiples configuraciones por sus keys
 */
export async function getConfigsByKeys(keys: string[]): Promise<{
  success: boolean;
  data?: ConfigMap;
  error?: string;
}> {
  try {
    if (!keys || keys.length === 0) {
      return { success: false, error: "Debe proporcionar al menos una key" };
    }

    const validKeys: string[] = [];
    for (const key of keys) {
      const validated = ConfigKeySchema.safeParse(key);
      if (validated.success) {
        validKeys.push(validated.data);
      }
    }

    if (validKeys.length === 0) {
      return { success: false, error: "No se proporcionaron keys válidas" };
    }

    const configs = await prisma.siteConfig.findMany({
      where: {
        key: { in: validKeys },
      },
    });

    const result: ConfigMap = {};
    for (const config of configs) {
      result[config.key] = config.value;
    }

    return { success: true, data: result };
  } catch (error) {
    console.error("[getConfigsByKeys] Error:", error);
    return { success: false, error: "Error al obtener configuraciones" };
  }
}

// ============================================
// MUTATIONS (Escritura - Requieren auth)
// ============================================

/**
 * Crea o actualiza una configuración del sitio
 */
export async function upsertConfig(
  key: string,
  value: string,
  type: string = "text",
  group: string = "general",
  label?: string | null,
): Promise<{
  success: boolean;
  data?: ISiteConfig;
  error?: string;
}> {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return { success: false, error: "No autorizado" };
  }

  try {
    const validated = UpsertConfigSchema.safeParse({
      key,
      value,
      type,
      group,
      label,
    });

    if (!validated.success) {
      const errors = validated.error.errors.map((e) => e.message).join(", ");
      return { success: false, error: errors };
    }

    const {
      key: validKey,
      value: validValue,
      type: validType,
      group: validGroup,
      label: validLabel,
    } = validated.data;

    const result = await prisma.siteConfig.upsert({
      where: {
        key: validKey,
      },
      update: {
        value: validValue,
        type: validType,
        group: validGroup,
        label: validLabel,
        updatedAt: new Date(),
      },
      create: {
        key: validKey,
        value: validValue,
        type: validType,
        group: validGroup,
        label: validLabel,
      },
    });

    // Invalidar todos los caches relacionados
    revalidateTag("cms-config");
    revalidateTag("site-config");
    revalidateTag("appearance", "max"); // Para appearance configs
    revalidatePath("/admin/settings");

    return { success: true, data: result };
  } catch (error) {
    console.error("[upsertConfig] Error:", error);
    return { success: false, error: "Error al guardar configuración" };
  }
}

/**
 * Elimina una configuración del sitio por su ID
 */
export async function deleteConfig(id: number): Promise<{
  success: boolean;
  data?: { deletedId: number; deletedKey: string };
  error?: string;
}> {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return { success: false, error: "No autorizado" };
  }

  try {
    const validated = DeleteConfigSchema.safeParse({ id });
    if (!validated.success) {
      return { success: false, error: validated.error.errors[0].message };
    }

    const existing = await prisma.siteConfig.findUnique({
      where: { id: validated.data.id },
    });

    if (!existing) {
      return { success: false, error: "Configuración no encontrada" };
    }

    await prisma.siteConfig.delete({
      where: { id: validated.data.id },
    });

    // Invalidar todos los caches relacionados
    revalidateTag("cms-config");
    revalidateTag("site-config");
    revalidateTag("appearance", "max");
    revalidatePath("/admin/settings");

    return {
      success: true,
      data: {
        deletedId: existing.id,
        deletedKey: existing.key,
      },
    };
  } catch (error) {
    console.error("[deleteConfig] Error:", error);
    return { success: false, error: "Error al eliminar configuración" };
  }
}

/**
 * Actualiza múltiples configuraciones de un grupo a la vez
 */
export async function upsertConfigBatch(
  group: string,
  configs: Array<{ key: string; value: string; type?: string; label?: string }>,
): Promise<{
  success: boolean;
  data?: { updated: number; created: number };
  error?: string;
}> {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return { success: false, error: "No autorizado" };
  }

  try {
    const validatedGroup = ConfigGroupSchema.safeParse(group);
    if (!validatedGroup.success) {
      return { success: false, error: validatedGroup.error.errors[0].message };
    }

    if (!configs || configs.length === 0) {
      return {
        success: false,
        error: "Debe proporcionar al menos una configuración",
      };
    }

    let updated = 0;
    let created = 0;

    await prisma.$transaction(async (tx) => {
      for (const config of configs) {
        const validated = UpsertConfigSchema.safeParse({
          key: config.key,
          value: config.value,
          type: config.type || "text",
          group: validatedGroup.data,
          label: config.label,
        });

        if (!validated.success) {
          console.warn(
            `[upsertConfigBatch] Skipping invalid config: ${config.key}`,
            validated.error.errors,
          );
          continue;
        }

        const { key, value, type, label } = validated.data;

        const existing = await tx.siteConfig.findUnique({
          where: { key },
        });

        if (existing) {
          await tx.siteConfig.update({
            where: { key },
            data: {
              value,
              type,
              group: validatedGroup.data,
              label,
              updatedAt: new Date(),
            },
          });
          updated++;
        } else {
          await tx.siteConfig.create({
            data: {
              key,
              value,
              type,
              group: validatedGroup.data,
              label,
            },
          });
          created++;
        }
      }
    });

    // Invalidar todos los caches relacionados
    revalidateTag("cms-config");
    revalidateTag("site-config");
    revalidateTag("appearance", "max");
    revalidatePath("/admin/settings");

    return {
      success: true,
      data: { updated, created },
    };
  } catch (error) {
    console.error("[upsertConfigBatch] Error:", error);
    return { success: false, error: "Error al guardar configuraciones" };
  }
}

// ============================================
// HELPERS (Funciones de conveniencia)
// ============================================

/**
 * Obtiene información de contacto
 */
export async function getContactInfo(): Promise<{
  success: boolean;
  data?: {
    phone: string | null;
    email: string | null;
    address: string | null;
    whatsapp: string | null;
  };
  error?: string;
}> {
  try {
    const configs = await prisma.siteConfig.findMany({
      where: {
        group: "contact",
      },
    });

    const map: Record<string, string> = {};
    for (const config of configs) {
      map[config.key] = config.value;
    }

    return {
      success: true,
      data: {
        phone: map.phone ?? null,
        email: map.email ?? null,
        address: map.address ?? null,
        whatsapp: map.whatsapp ?? null,
      },
    };
  } catch (error) {
    console.error("[getContactInfo] Error:", error);
    return { success: false, error: "Error al obtener info de contacto" };
  }
}

/**
 * Obtiene links de redes sociales
 */
export async function getSocialLinks(): Promise<{
  success: boolean;
  data?: {
    facebook: string | null;
    instagram: string | null;
    youtube: string | null;
    twitter: string | null;
    linkedin: string | null;
    tiktok: string | null;
  };
  error?: string;
}> {
  try {
    const configs = await prisma.siteConfig.findMany({
      where: {
        group: "social",
      },
    });

    const map: Record<string, string> = {};
    for (const config of configs) {
      map[config.key] = config.value;
    }

    return {
      success: true,
      data: {
        facebook: map.facebook ?? null,
        instagram: map.instagram ?? null,
        youtube: map.youtube ?? null,
        twitter: map.twitter ?? null,
        linkedin: map.linkedin ?? null,
        tiktok: map.tiktok ?? null,
      },
    };
  } catch (error) {
    console.error("[getSocialLinks] Error:", error);
    return { success: false, error: "Error al obtener redes sociales" };
  }
}

/**
 * Inicializa configuraciones predeterminadas si no existen
 */
export async function seedDefaultConfigs(
  defaults?: Array<{
    key: string;
    value: string;
    type?: string;
    group: string;
    label?: string;
  }>,
): Promise<{
  success: boolean;
  data?: { created: number; skipped: number };
  error?: string;
}> {
  const configsToSeed = defaults ?? PREDEFINED_CONFIGS;

  try {
    let created = 0;
    let skipped = 0;

    for (const config of configsToSeed) {
      const existing = await prisma.siteConfig.findUnique({
        where: { key: config.key },
      });

      if (!existing) {
        await prisma.siteConfig.create({
          data: {
            key: config.key,
            value: config.value,
            type: config.type || "text",
            group: config.group,
            label: config.label,
          },
        });
        created++;
      } else {
        skipped++;
      }
    }

    return {
      success: true,
      data: { created, skipped },
    };
  } catch (error) {
    console.error("[seedDefaultConfigs] Error:", error);
    return { success: false, error: "Error al inicializar configuraciones" };
  }
}
