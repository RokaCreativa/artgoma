import prisma from "@/lib/db";

export const getCollaborators = async () => {
  try {
    const collaborators: ICollaborator[] = await prisma.collaborator.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return collaborators;
  } catch (error) {
    throw new Error("Failed to fetch collaborators");
  }
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
