import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Clock, MapPinIcon } from "lucide-react";
import getActiveEvents from "@/queries/getActiveEvents";
import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";
import { Locale } from "@/configs/i18n.config";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export default async function EventsPage({ params }: { params: Promise<{ lang: Locale }> }) {
  noStore();
  const { lang } = await params;
  const events = await getActiveEvents();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {events.map((event) => (
        <div
          key={event.id}
          className="rounded-2xl hover:shadow-red-600/50 shadow-xl group transition-transform bg-white overflow-hidden"
        >
          <Carousel className="w-full mx-auto">
            <CarouselContent>
              {event.images.map((image, index) => (
                <CarouselItem key={index}>
                  <div className="relative h-[230px]">
                    <Image
                      alt={`${event.name} image`}
                      src={image}
                      fill
                      className="group-hover:scale-105 transition-transform object-cover w-full h-full rounded-t-lg"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="ml-14" />
            <CarouselNext className="mr-14" />
          </Carousel>
          <div className="p-4">
            <div className="flex justify-between">
              <div>
                <h2 className="text-xl font-extrabold mb-2">{event.name}</h2>
                <p className="flex items-center gap-1 text-xs text-gray-500" suppressHydrationWarning>
                  <Clock width={15} height={15} /> {new Date(event.date).toLocaleDateString()} -{" "}
                  {new Date(event.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
                <p className="flex items-center gap-1 text-sm text-gray-500 mb-1">
                  <MapPinIcon width={15} height={15} /> {event.place}
                </p>
              </div>
              <div>
                <Link
                  href={`/${lang}/events/${event.slug}`}
                  className={cn(buttonVariants({ variant: "default", size: "sm" }))}
                >
                  Reserve
                </Link>
              </div>
            </div>

            <p className="text-gray-700 line-clamp-2">{event.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
