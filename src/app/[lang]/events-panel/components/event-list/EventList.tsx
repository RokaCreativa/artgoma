import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import getAllEvents from "@/queries/getAllEvents";
import { Calendar, Circle, Edit, Edit3, MapPinIcon, Text, Users } from "lucide-react";
import Link from "next/link";
import ButtonDeactivate from "./ButtonDeactivate";
import { cn } from "@/lib/utils";
import ButtonActivate from "./ButtonActivate";
import { unstable_noStore as noStore } from "next/cache";
import { Suspense } from "react";
import SkeletonEventList from "./SkeletonEventList";

export default async function EventList() {
  return (
    <Suspense fallback={<SkeletonEventList />}>
      <LoadEvents />
    </Suspense>
  );
}

const LoadEvents = async () => {
  noStore();

  const events = await getAllEvents();

  return (
    <div className="container mx-auto p-4 w-full md:w-3/4 lg:w-3/5 md:p-6 rounded-xl bg-white/30 backdrop-blur-3xl shadow-xl shadow-gray-800">
      <h1 className="text-md md:text-2xl font-bold mb-4 text-white text-center">Event List</h1>
      <div className="space-y-4">
        {events.map((event) => (
          <Card key={event.id} className="flex flex-col lg:flex-row justify-between items-center">
            <CardContent className="py-4">
              <h2 className="text-xl font-semibold">{event.name}</h2>
              <div className="flex gap-2">
                <Calendar stroke="black" height={20} width={20} />
                <p className="text-sm text-gray-500"> {new Date(event.date).toLocaleDateString()}</p>
              </div>

              <div className="flex gap-2">
                <MapPinIcon stroke="black" height={20} width={20} /> <p>{event.place}</p>
              </div>

              <p className="text-sm">{event.description}</p>
              <div className="text-sm flex items-center gap-2">
                <p>State:</p>
                {event.isActive ? (
                  <div className="flex gap-2 items-center">
                    <p>Active</p> <Circle height={10} width={10} fill="#49ff73" />
                  </div>
                ) : (
                  <div className="flex gap-2 items-center">
                    <p>Unabled</p> <Circle height={10} width={10} fill="#ef3939" />
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex space-x-2">
              <div className={cn(buttonVariants({ variant: "outline" }), "cursor-pointer h-8 md:h-10")}>
                <Edit3 height={15} width={15} />
              </div>

              <Button className="h-8 md:h-10" asChild>
                <Link href={`/events/${event.slug}`}>
                  <Text height={15} width={15} />
                </Link>
              </Button>
              <Button className="h-8 md:h-10" asChild>
                <Link href={`/events/${event.slug}/visits`}>
                  <Users height={15} width={15} />
                </Link>
              </Button>
              {event.isActive ? <ButtonDeactivate event={event} /> : <ButtonActivate event={event} />}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};
