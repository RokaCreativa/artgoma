import NextAuth from "next-auth";
import { User } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: number;
      email: string;
      name: string;
      image?: string | null;
      phone?: string | null;
      isActive: boolean;
      badge?: string | null;
      attendances: number;
    };
  }
}

declare module "next-auth" {
  interface User {
    id: number;
    name: string | null;
    email: string;
    name: string;
    image?: string | null;
    phone?: string | null;
    isActive?: boolean;
    badge?: string | null;
    attendances?: number;
  }
}
