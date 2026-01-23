"use server";

import prisma from "@/lib/db";
import { State } from "@/types/state";
import { z } from "zod";
import bcrypt from "bcrypt";

const userSchema = z
  .object({
    name: z.string().min(2, { message: "Last name must have at least 2 characters" }),
    email: z.string().email({ message: "Invalid email address" }),
    phone: z.string().min(8, { message: "Phone must have at least 8 characters" }),
    password: z
      .string()
      .min(8, { message: "Password must have at least 8 characters" })
      .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
      .regex(/[0-9]/, { message: "Password must contain at least one number" }),
    repassword: z.string(),
  })
  .refine((data) => data.password === data.repassword, {
    message: "Passwords do not match",
    path: ["repassword"],
  });

export async function registerUser(prevState: any, formData: FormData) {
  const validation = userSchema.safeParse({
    name: formData.get("lastName"),
    email: formData.get("email"),
    password: formData.get("password"),
    repassword: formData.get("repassword"),
    phone: formData.get("phone"),
  });

  if (!validation.success) {
    const state: State = {
      status: "error",
      errors: validation.error.flatten().fieldErrors,
      message: "Validation failed. Please check your input.",
    };

    return state;
  }

  const { name, email, phone, password } = validation.data;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      if (!existingUser.password) {
        const hashedPassword = await bcrypt.hash(password, 10);

        const updatedUser = await prisma.user.update({
          where: { email },
          data: {
            name,
            phone,
            password: hashedPassword,
          },
        });

        const { password: _, ...user } = updatedUser;

        return {
          status: "success",
          message: "User updated successfully! Please log in with your new credentials.",
          data: user,
        };
      }

      return {
        status: "error",
        message: "Authentication failed: Email already in use.",
      };
    }

    let hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        password: hashedPassword,
      },
    });

    const { password: _, ...user } = newUser; //To not return the password to the client

    return {
      status: "success",
      message: "User registered successfully!",
      data: user,
    };
  } catch (error) {
    return {
      status: "error",
      message: "Failed to register user. Please try again later.",
    };
  }
}

export default registerUser;
