"use server";

import prisma from "@/lib/db";
import { State } from "@/types/state";
import { z } from "zod";

const visitSchema = z.object({
  phone: z.string().optional(),
  eventId: z.number().nullable().optional(),
  userId: z.number(),
  companions: z.array(z.object({ name: z.string() })).optional(),
  date: z.string(),
  time: z.string().nullable().optional(),
  collaborator: z.string().nullable().optional(),
});

export default async function addConfirmations(prevState: any, formData: FormData) {
  try {
    const data = {
      phone: (formData.get("phone") as string) || null,
      eventId: parseInt(formData.get("eventId") as string, 10) || null,
      userId: parseInt(formData.get("userId") as string, 10),
      companions: formData.get("companions") ? JSON.parse(formData.get("companions") as string) : [],
      date: formData.get("date") as string,
      time: formData.get("time") as string,
      collaborator: formData.get("collaborator"),
    };

    const validation = visitSchema.safeParse(data);

    if (!validation.success) {
      const state: State = {
        status: "error",
        message: "Validation failed",
        errors: validation.error.flatten().fieldErrors,
      };

      return state;
    }

    const { collaborator, phone, userId, date, time, companions, eventId } = validation.data;

    const response = collaborator
      ? await prisma.collaborator.findUnique({
          where: { code: collaborator },
        })
      : null;

    const visit = await prisma.visit.create({
      data: {
        eventId: eventId,
        userId: userId,
        companions: JSON.stringify(companions),
        date: time ? new Date(`${date}T${time}Z`) : date,
        collaboratorId: response ? response.id : null,
      },
    });

    if (phone) {
      await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          phone: phone,
        },
      });
    }

    return {
      status: "success",
      message: "Visit added successfully",
      data: visit,
    };
  } catch (error) {
    return {
      status: "error",
      message: "An error occurred while adding the visit.",
    };
  }
}
