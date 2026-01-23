import prisma from "@/lib/db";

export const getVisits = async (date?: string): Promise<ResultVisit> => {
  let dateFilter = {};

  if (date) {
    const startOfDay = new Date(`${date}T00:00:00`);
    const endOfDay = new Date(`${date}T23:59:59`);
    dateFilter = {
      date: {
        gte: startOfDay,
        lt: endOfDay,
      },
    };
  }

  const visits = await prisma.visit.findMany({
    where: {
      eventId: null,
      ...dateFilter,
    },
    orderBy: {
      date: "desc",
    },
    include: {
      User: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
      Collaborator: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  const count = await prisma.visit.count({
    where: {
      eventId: null,
      ...dateFilter,
    },
  });

  return {
    visits: visits,
    count,
  };
};

export interface ResultVisit {
  visits: Array<IVisit>;
  count: number;
}

export interface IVisit {
  id: number;
  eventId: number | null;
  userId: number;
  companions: string;
  date: Date;
  isCanceled: boolean;
  createdAt: Date;
  updatedAt: Date;
  User: {
    id: number;
    name: string;
    email: string;
    phone: string | null;
  } | null;
  collaboratorId: number | null;
  Collaborator: {
    id: number;
    name: string;
  } | null;
}
