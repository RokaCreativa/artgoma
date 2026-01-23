import { Locale } from "@/configs/i18n.config";
import getEventBySlug from "@/queries/getEventBySlug";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import Image from "next/image";
import ConfirmOnEvents from "../components/ConfirmOnEvents";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import FormConfirmOnEvents from "../components/FormConfirmOnEvents";

const EventPage = async ({ params: { slug, lang } }: { params: { lang: Locale; slug: string } }) => {
  const event = await getEventBySlug({ slug });
  const session = await getServerSession(authOptions);

  if (!event) {
    return <div className="text-center py-20">Event not found</div>;
  }

  return (
    <div className="flex flex-col md:flex-row gap-8 p-4 md:p-10 bg-white/90 shadow-xl shadow-red-700/60 rounded-2xl">
      <div className="md:w-1/2 lg:w-1/3">
        <Carousel className="w-full mx-auto rounded-xl overflow-hidden">
          <CarouselContent>
            {event.images.map((image, index) => (
              <CarouselItem key={index}>
                <div className="relative h-[200px] md:h-[230px] lg:h-[300px]">
                  <Image
                    alt={`${event.name} image`}
                    src={image}
                    fill
                    className="group-hover:scale-105 transition-transform object-cover w-full h-full rounded-xl"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="ml-14" />
          <CarouselNext className="mr-14" />
        </Carousel>
      </div>
      <div className="flex flex-col justify-around gap-4">
        <div>
          <h1 className="text-3xl font-bold">{event.name}</h1>
          <p className="text-gray-600 text-xl pb-2">
            {new Date(event.date).toLocaleDateString()} | {event.place}
          </p>
          <p className="text-gray-900 md:text-xl">{event.description || "No description available for this event."}</p>
        </div>
        {session ? (
          <FormConfirmOnEvents event={event} session={session} />
        ) : (
          <ConfirmOnEvents lang={lang} redirect={event.slug} eventId={event.id} />
        )}
      </div>
    </div>
  );
};

export default EventPage;
