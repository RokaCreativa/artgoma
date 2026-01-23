"use server";

import prisma from "@/lib/db";
import { State } from "@/types/state";
import { z } from "zod";

const visitSchema = z.object({
  name: z.string(),
  phone: z.string(),
  email: z.string().email(),
  eventId: z.number().nullable().optional(),
  companions: z.array(z.object({ name: z.string() })).optional(),
  date: z.string(),
  time: z.string().nullable().optional(),
  collaborator: z.string().nullable().optional(),
});

export default async function confirmWithoutAuth(prevState: any, formData: FormData) {
  try {
    const data = {
      name: (formData.get("name") as string) || null,
      email: (formData.get("email") as string) || null,
      phone: (formData.get("phone") as string) || null,
      eventId: parseInt(formData.get("eventId") as string, 10) || null,
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

    const { collaborator, phone, name, email, date, time, companions, eventId } = validation.data;

    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (user) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          attendances: user.attendances + 1,
        },
      });
    }

    const newUser = !user
      ? await prisma.user.create({
          data: {
            name: name,
            email: email,
            phone: phone,
            badge: "vip",
          },
        })
      : null;

    const isCollaborator = collaborator
      ? await prisma.collaborator.findUnique({
          where: { code: collaborator },
        })
      : null;

    const visit = await prisma.visit.create({
      data: {
        eventId: eventId,
        userId: newUser?.id ?? (user?.id as number),
        companions: JSON.stringify(companions),
        date: time ? new Date(`${date}T${time}Z`) : date,
        collaboratorId: isCollaborator ? isCollaborator.id : null,
      },
    });

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
