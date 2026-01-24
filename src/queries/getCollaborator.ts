import prisma from "@/lib/db";

export const getCollaborator = async (code: string | undefined) => {
  if (!code) {
    return null;
  }

  const collaborators = await prisma.collaborator.findFirst({
    where: {
      code: code,
    },
  });

  return collaborators;
};

export interface ICollaborator {
  id: number;
  name: string;
  slogan?: string | null;
  slug: string | null;
  code: string;
  image?: string | null;
  email: string;
  phone?: string | null;
  address?: string | null;
  isActive: boolean;
  company: string;
  createdAt: Date;
  updatedAt: Date;
}
