// 🧭 MIGA DE PAN: Slider Server Actions - CRUD para sliders del CMS
// 📍 UBICACIÓN: src/actions/cms/slider.ts
// 🎯 PORQUÉ EXISTE: Gestionar sliders y sus items desde el panel admin
// 🔄 FLUJO: Admin UI → Server Action → Prisma → BD
// 🚨 CUIDADO: Todas las acciones deben validar autenticación
// 📋 SPEC: SPEC-26-01-2026-CMS-ContentManager

"use server";

import prisma from "@/lib/db";
import { revalidatePath, revalidateTag } from "next/cache";
import { isAdminAuthenticated } from "@/lib/cms/auth";
import { z } from "zod";

// ============================================
// SCHEMAS DE VALIDACIÓN
// ============================================

const SliderSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  slug: z.string().min(1, "El slug es requerido").regex(/^[a-z0-9-]+$/, "Solo minúsculas, números y guiones"),
  section: z.string().min(1, "La sección es requerida"),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
  position: z.number().int().default(0),
});

const SliderItemSchema = z.object({
  sliderId: z.number().int(),
  type: z.enum(["youtube", "image", "video_url"]),
  url: z.string().optional(),
  youtubeId: z.string().optional(),
  title: z.string().optional(),
  alt: z.string().optional(),
  artistName: z.string().optional(),
  width: z.number().int().optional(),
  height: z.number().int().optional(),
  position: z.number().int().default(0),
  isActive: z.boolean().default(true),
});

// ============================================
// TIPOS
// ============================================

export type SliderWithItems = Awaited<ReturnType<typeof getSliderById>>;
export type SliderItemType = z.infer<typeof SliderItemSchema>;

// ============================================
// SLIDERS CRUD
// ============================================

/**
 * Obtiene todos los sliders (con conteo de items)
 */
export async function getSliders() {
  const sliders = await prisma.slider.findMany({
    orderBy: { position: "asc" },
    include: {
      _count: {
        select: { items: true },
      },
    },
  });

  return sliders;
}

/**
 * Obtiene un slider por ID con todos sus items
 */
export async function getSliderById(id: number) {
  const slider = await prisma.slider.findUnique({
    where: { id },
    include: {
      items: {
        orderBy: { position: "asc" },
      },
    },
  });

  return slider;
}

/**
 * Obtiene un slider por sección (para el frontend)
 */
export async function getSliderBySection(section: string) {
  const slider = await prisma.slider.findFirst({
    where: {
      section,
      isActive: true,
    },
    include: {
      items: {
        where: { isActive: true },
        orderBy: { position: "asc" },
      },
    },
  });

  return slider;
}

/**
 * Crea un nuevo slider
 */
export async function createSlider(data: z.infer<typeof SliderSchema>) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return { success: false, error: "No autorizado" };
  }

  try {
    const validated = SliderSchema.parse(data);

    // Verificar que el slug no existe
    const existing = await prisma.slider.findUnique({
      where: { slug: validated.slug },
    });

    if (existing) {
      return { success: false, error: "Ya existe un slider con ese slug" };
    }

    const slider = await prisma.slider.create({
      data: validated,
    });

    revalidateTag("sliders"); // Invalida cache de unstable_cache
    revalidatePath("/admin/sliders");
    revalidatePath("/"); // Revalidar home

    return { success: true, data: slider };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    return { success: false, error: "Error al crear slider" };
  }
}

/**
 * Actualiza un slider
 */
export async function updateSlider(id: number, data: Partial<z.infer<typeof SliderSchema>>) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return { success: false, error: "No autorizado" };
  }

  try {
    const slider = await prisma.slider.update({
      where: { id },
      data,
    });

    revalidateTag("sliders"); // Invalida cache de unstable_cache
    revalidatePath("/admin/sliders");
    revalidatePath(`/admin/sliders/${id}`);
    revalidatePath("/");

    return { success: true, data: slider };
  } catch (error) {
    return { success: false, error: "Error al actualizar slider" };
  }
}

/**
 * Elimina un slider (cascade elimina items)
 */
export async function deleteSlider(id: number) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return { success: false, error: "No autorizado" };
  }

  try {
    await prisma.slider.delete({
      where: { id },
    });

    revalidateTag("sliders"); // Invalida cache de unstable_cache
    revalidatePath("/admin/sliders");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    return { success: false, error: "Error al eliminar slider" };
  }
}

// ============================================
// SLIDER ITEMS CRUD
// ============================================

/**
 * Crea un nuevo item en un slider
 */
export async function createSliderItem(data: z.infer<typeof SliderItemSchema>) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return { success: false, error: "No autorizado" };
  }

  try {
    const validated = SliderItemSchema.parse(data);

    // Obtener la posición máxima actual
    const maxPosition = await prisma.sliderItem.findFirst({
      where: { sliderId: validated.sliderId },
      orderBy: { position: "desc" },
      select: { position: true },
    });

    const item = await prisma.sliderItem.create({
      data: {
        ...validated,
        position: validated.position || (maxPosition?.position ?? 0) + 1,
      },
    });

    revalidateTag("sliders"); // Invalida cache de unstable_cache
    revalidatePath(`/admin/sliders/${data.sliderId}`);
    revalidatePath("/");

    return { success: true, data: item };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    return { success: false, error: "Error al crear item" };
  }
}

/**
 * Actualiza un item
 */
export async function updateSliderItem(id: number, data: Partial<z.infer<typeof SliderItemSchema>>) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return { success: false, error: "No autorizado" };
  }

  try {
    const item = await prisma.sliderItem.update({
      where: { id },
      data,
    });

    revalidateTag("sliders"); // Invalida cache de unstable_cache
    revalidatePath(`/admin/sliders/${item.sliderId}`);
    revalidatePath("/");

    return { success: true, data: item };
  } catch (error) {
    return { success: false, error: "Error al actualizar item" };
  }
}

/**
 * Elimina un item
 */
export async function deleteSliderItem(id: number) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return { success: false, error: "No autorizado" };
  }

  try {
    const item = await prisma.sliderItem.delete({
      where: { id },
    });

    revalidateTag("sliders"); // Invalida cache de unstable_cache
    revalidatePath(`/admin/sliders/${item.sliderId}`);
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    return { success: false, error: "Error al eliminar item" };
  }
}

/**
 * Reordena los items de un slider
 */
export async function reorderSliderItems(sliderId: number, itemIds: number[]) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return { success: false, error: "No autorizado" };
  }

  try {
    // Actualizar posiciones en transacción
    await prisma.$transaction(
      itemIds.map((id, index) =>
        prisma.sliderItem.update({
          where: { id },
          data: { position: index },
        })
      )
    );

    revalidateTag("sliders"); // Invalida cache de unstable_cache
    revalidatePath(`/admin/sliders/${sliderId}`);
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    return { success: false, error: "Error al reordenar items" };
  }
}

/**
 * Toggle activo/inactivo de un item
 */
export async function toggleSliderItemActive(id: number) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return { success: false, error: "No autorizado" };
  }

  try {
    const item = await prisma.sliderItem.findUnique({ where: { id } });
    if (!item) {
      return { success: false, error: "Item no encontrado" };
    }

    const updated = await prisma.sliderItem.update({
      where: { id },
      data: { isActive: !item.isActive },
    });

    revalidateTag("sliders"); // Invalida cache de unstable_cache
    revalidatePath(`/admin/sliders/${item.sliderId}`);
    revalidatePath("/");

    return { success: true, data: updated };
  } catch (error) {
    return { success: false, error: "Error al cambiar estado" };
  }
}
