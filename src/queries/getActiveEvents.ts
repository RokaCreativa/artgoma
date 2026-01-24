import prisma from "@/lib/db";

const getActiveEvents = async () => {
  const activeEvent = await prisma.event.findMany({
    where: {
      isActive: true,
    },
    orderBy: { date: "asc" },
  });

  return activeEvent;
};

export default getActiveEvents;

export interface IEvent {
  id: number;
  name: string;
  slug: string;
  date: Date;
  place: string;
  isActive: boolean;
  description: string | null;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}
