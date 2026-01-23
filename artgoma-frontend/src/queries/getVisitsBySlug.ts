import prisma from "@/lib/db";

export const getVisitsBySlug = async (slug: string) => {
  const visits = await prisma.event.findFirst({
    where: {
      slug: slug,
    },
    select: {
      name: true,
      Visits: {
        select: {
          id: true,
          companions: true,
          User: {
            select: {
              name: true,
              email: true,
              phone: true,
              badge: true,
              createdAt: true,
            },
          },
          Collaborator: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  return {
    visits: visits,
  };
};
