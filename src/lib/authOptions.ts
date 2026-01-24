import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/db";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "Karen" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const userFound = await prisma.user.findUnique({
          where: {
            email: credentials?.email,
          },
        });

        if (!userFound) {
          throw new Error("User not found");
        }

        if (userFound.password) {
          const matchPassword = await bcrypt.compare(credentials?.password as string, userFound.password);

          if (!matchPassword) {
            throw new Error("Wrong password");
          }

          return {
            id: userFound.id,
            name: userFound.name,
            email: userFound.email,
          };
        }

        return null;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      const existingUser = await prisma.user.findUnique({
        where: { email: user?.email as string },
      });

      if (!existingUser) {
        await prisma.user.create({
          data: {
            name: user?.name as string,
            email: user?.email as string,
            image: (user?.image as string) ?? "",
            password: "",
          },
        });
      }
      return true;
    },
    async session({ session, token }) {
      const dbUser = await prisma.user.findUnique({
        where: { email: session?.user?.email as string },
      });

      if (dbUser) {
        session.user.id = dbUser.id;
        session.user.image = dbUser.image ?? null;
        session.user.phone = dbUser.phone ?? null;
        session.user.name = dbUser.name as string;
        session.user.badge = dbUser.badge ?? null;
        session.user.attendances = dbUser.attendances;
        session.user.isActive = dbUser.isActive;
      }

      return session;
    },
  },

  pages: {
    signIn: "/login",
    signOut: "/",
    error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
