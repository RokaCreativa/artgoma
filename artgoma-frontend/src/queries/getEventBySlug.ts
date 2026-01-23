import prisma from "@/lib/db";

const getEventBySlug = async ({ slug }: { slug: string }) => {
  const activeEvent = await prisma.event.findFirst({
    where: {
      slug: slug,
    },
    orderBy: { date: "asc" },
  });

  return activeEvent;
};

export default getEventBySlug;

export interface IEvent {
  name: string;
  id: number;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
  slug: string;
  isActive: boolean;
  description: string | null;
  place: string;
  images: string[];
}
