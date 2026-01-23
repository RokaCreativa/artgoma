"use server";

import prisma from "@/lib/db";
import { z } from "zod";
import { State } from "@/types/state";
import { revalidatePath } from "next/cache";

const eventSchema = z.object({
  name: z.string().min(2, { message: "Name must have at least 2 characters" }),
  date: z.string().refine((value) => !isNaN(Date.parse(value)), {
    message: "Invalid date format.",
  }),
  place: z.string().min(2, { message: "Place must have at least 2 characters" }),
  description: z.string().optional(),
  images: z.array(z.string(), { message: "Images are required" }),
});

export async function addEvent(prevState: any, formData: FormData) {
  const validation = eventSchema.safeParse({
    name: formData.get("name"),
    date: formData.get("datetime"),
    place: formData.get("place"),
    description: formData.get("description"),
    images: JSON.parse(formData.get("images") as string),
  });

  if (!validation.success) {
    const state: State = {
      status: "error",
      errors: validation.error.flatten().fieldErrors,
      message: "Validation failed. Please check your input.",
    };

    return state;
  }

  const { name, date, place, description, images } = validation.data;
  const slug = name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .normalize("NFD")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\u0300-\u036f]/g, "");

  try {
    const eventDate = new Date(date);

    const newEvent = await prisma.event.create({
      data: {
        name,
        slug,
        date: eventDate,
        place,
        description,
        images,
      },
    });

    return {
      status: "success",
      message: "Event added successfully!",
      data: newEvent,
    };
  } catch (error) {
    return {
      status: "error",
      message: "There was an error adding this event. Please try again later.",
    };
  }
}

export async function deleteEvent(id: number) {
  try {
    const numeric = Number(id);

    const deletedEvent = await prisma.event.delete({
      where: { id: numeric },
    });

    return {
      status: "success",
      message: "Event deleted successfully!",
      data: deletedEvent,
    };
  } catch (error: any) {
    console.error("Error deleting event:", error);

    if (error.code === "P2025") {
      // Prisma error cuando el registro no existe
      return {
        status: "error",
        message: "Event not found.",
      };
    }

    return {
      status: "error",
      message: "Failed to delete event. Please try again later.",
    };
  }
}

export async function desableEvent({ id, path }: { id: number; path: string }) {
  try {
    const formatedId = Number(id);

    const desableEvent = await prisma.event.update({
      where: { id: formatedId },
      data: {
        isActive: false,
      },
    });

    revalidatePath(path);
    return {
      status: "success",
      message: "Event desable successfully!",
      data: desableEvent,
    };
  } catch (error: any) {
    if (error.code === "P2025") {
      // Prisma error cuando el registro no existe
      return {
        status: "error",
        message: "Event not found.",
      };
    }

    return {
      status: "error",
      message: "Could not deactivate event. Please try again later.",
    };
  }
}

export async function enableEvent({ id, path }: { id: number; path: string }) {
  try {
    const formatedId = Number(id);

    const enabledEvent = await prisma.event.update({
      where: { id: formatedId },
      data: {
        isActive: true,
      },
    });

    revalidatePath(path);

    return {
      status: "success",
      message: "Event enable successfully!",
      data: enabledEvent,
    };
  } catch (error: any) {
    if (error.code === "P2025") {
      // Prisma error cuando el registro no existe
      return {
        status: "error",
        message: "Event not found.",
      };
    }

    return {
      status: "error",
      message: "Could not enable event. Please try again later.",
    };
  }
}
