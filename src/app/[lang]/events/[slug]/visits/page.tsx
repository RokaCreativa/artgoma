import { Locale } from "@/configs/i18n.config";
import { getVisitsBySlug } from "@/queries/getVisitsBySlug";
import { BadgeCheck, CalendarCheckIcon, Mail, PhoneIcon, Users } from "lucide-react";
import React from "react";

const VisitsByEventPage = async ({ params: { slug, lang } }: { params: { lang: string; slug: string } }) => {
  const { visits } = await getVisitsBySlug(slug);

  if (!visits) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <h2 className="text-white text-4xl">No visits found for this event.</h2>
      </div>
    );
  }

  return (
    <div className="bg-white/90 p-8 rounded-2xl shadow-lg shadow-red-600">
      <h1 className="font-semibold text-xl">Visits for Event: {visits.name}</h1>
      <ul className="flex flex-wrap items-baseline gap-4 p-4">
        {visits.Visits.map((visit, index: number) => (
          <li key={visit.id} className="w-full md:w-auto border p-4 rounded-lg shadow-xl bg-white">
            {visit.User && (
              <div>
                <p className="font-semibold">{visit.User.name}</p>
                <p className="flex gap-2 items-center">
                  <Mail height={15} width={15} /> {visit.User.email}
                </p>
                <p className="flex gap-2 items-center">
                  <PhoneIcon height={15} width={15} /> {visit.User.phone}
                </p>
                <p className="flex gap-2 items-center">
                  <BadgeCheck height={15} width={15} /> {visit.User.badge}
                </p>
                <p className="flex gap-2 items-center">
                  <CalendarCheckIcon height={15} width={15} />
                  Joined: {new Date(visit.User.createdAt).toLocaleDateString(lang)}
                </p>
              </div>
            )}

            {JSON.parse(visit.companions).length > 0 && (
              <>
                <div className="flex gap-2 items-center">
                  <Users height={15} width={15} />
                  <p>Companions:</p>
                </div>

                <div className="flex flex-wrap">
                  {JSON.parse(visit.companions).map((comp: any, index: number) => {
                    return (
                      <p className="border px-2 shadow-sm rounded-lg" key={index}>
                        {comp.name}
                      </p>
                    );
                  })}
                </div>
              </>
            )}

            {visit.Collaborator && (
              <div>
                <h3>Collaborator:</h3>
                <p>Name: {visit.Collaborator.name}</p>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VisitsByEventPage;
