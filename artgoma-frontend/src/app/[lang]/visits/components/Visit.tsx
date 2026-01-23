import { cn } from "@/lib/utils";
import { IVisit } from "@/queries/getVisits";

import { Calendar, Clock, MailIcon, Phone, User2 } from "lucide-react";

const Visit = ({ visit }: { visit: IVisit }) => {
  const visitDate = new Date(visit.date);
  const currentDate = new Date();

  const visitDateString = visitDate.toISOString().split("T")[0];
  const currentDateString = new Date(currentDate.toISOString().split("T")[0]).toISOString().split("T")[0];

  const companionsArray = visit.companions ? JSON.parse(visit.companions) : [];

  return (
    <div
      className={cn(
        "flex flex-col justify-center border border-black p-2 rounded-md",
        visitDateString < currentDateString && "bg-black/10"
      )}
    >
      {visitDateString > currentDateString && <p className="text-center text-blue-500 font-semibold">Pending</p>}
      {visitDateString < currentDateString && <p className="text-center text-red-500">Expired</p>}
      {visitDateString === currentDateString && (
        <p className="text-center text-green-500 font-semibold">To use today</p>
      )}
      <div className="flex gap-2">
        <User2 />

        {visit.User?.name}
      </div>
      <div className="flex gap-2">
        <MailIcon /> {visit.User?.email || "N/A"}
      </div>
      <div className="flex gap-2">
        <Phone /> {visit.User?.phone || "no phone"}
      </div>
      <div className="flex gap-2" suppressHydrationWarning>
        {/*//https://nextjs.org/docs/messages/react-hydration-error#solution-3-using-suppresshydrationwarning*/}
        <Calendar /> {visit.date.toLocaleDateString()}
      </div>
      <div className="flex gap-2" suppressHydrationWarning>
        <Clock /> {visit.date.toLocaleTimeString() || "N/A"}
      </div>
      <div className="flex gap-2">
        {visit.collaboratorId && (
          <p>
            <span className="font-semibold">Collaborator: </span>
            {visit.collaboratorId || "N/A"}
          </p>
        )}
      </div>
      <div className="flex gap-2 flex-wrap">
        {companionsArray.length > 0 && <p className="font-semibold">Companions:</p>}
        <ul className="flex gap-2 flex-wrap">
          {companionsArray.map((companion: { id: number; name: string }, id: number) => (
            <li key={id} className="rounded-md border px-2">
              {companion.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Visit;
