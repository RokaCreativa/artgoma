"use server";

import prisma from "@/lib/db";
import { z } from "zod";
import { State } from "@/types/state";
import generateCode from "@/utils/generateCode";

const collaboratorSchema = z.object({
  name: z.string().min(2, { message: "Name must have at least 2 characters" }),
  slogan: z.string().min(2, { message: "Slogan must have at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().min(8, { message: "Phone must have at least 8 characters" }),
  address: z.string().optional(),
  code: z.string().min(1, { message: "Code is required" }),
  company: z.string().min(1, { message: "Company is required" }),
});

export async function addCollaborator(prevState: any, formData: FormData) {
  const validation = collaboratorSchema.safeParse({
    name: formData.get("name"),
    slogan: formData.get("slogan"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    address: formData.get("address"),
    code: generateCode(),
    company: formData.get("company"),
  });

  if (!validation.success) {
    const state: State = {
      status: "error",
      errors: validation.error.flatten().fieldErrors,
      message: "Validation failed. Please check your input.",
    };

    return state;
  }

  const { name, slogan, email, phone, address, code, company } = validation.data;

  try {
    const newCollaborator = await prisma.collaborator.create({
      data: { name, slogan, email, phone, address, code, company },
    });

    return {
      status: "success",
      message: "Collaborator added successfully!",
      data: newCollaborator,
    };
  } catch (error) {
    return {
      status: "error",
      message: "Failed to add collaborator. Please try again later.",
    };
  }
}

export async function deleteCollaborator(id: string) {
  try {
    const numeric = Number(id);

    const deletedCollaborator = await prisma.collaborator.delete({
      where: { id: numeric },
    });

    return {
      status: "success",
      message: "Collaborator deleted successfully!",
      data: deletedCollaborator,
    };
  } catch (error: any) {
    console.error("Error deleting collaborator:", error);

    if (error.code === "P2025") {
      // Prisma error cuando el registro no existe
      return {
        status: "error",
        message: "Collaborator not found.",
      };
    }

    return {
      status: "error",
      message: "Failed to delete collaborator. Please try again later.",
    };
  }
}
