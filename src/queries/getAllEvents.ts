import prisma from "@/lib/db";

const getAllEvents = async () => {
  const activeEvent = await prisma.event.findMany({
    orderBy: { date: "asc" },
  });

  return activeEvent;
};

export default getAllEvents;
