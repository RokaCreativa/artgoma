"use client";

import { desableEvent } from "@/actions/event";
import { Button } from "@/components/ui/button";
import { CalendarX2Icon, Loader2 } from "lucide-react";
import { usePathname } from "next/navigation";
import { useTransition } from "react";

const ButtonDeactivate = ({
  event,
}: {
  event: {
    isActive: boolean;
    name: string;
    id: number;
    slug: string;
    date: Date;
    place: string;
    description: string | null;
    images: string[];
    createdAt: Date;
    updatedAt: Date;
  };
}) => {
  const pathName = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleDesableEvent = () => {
    startTransition(async () => {
      try {
        const data = await desableEvent({ id: event.id, path: pathName });
        if (data.status === "success") {
          alert(data.message);
        }
      } catch (error: any) {
        alert(error.message);
      }
    });
  };

  return (
    <Button
      disabled={isPending ? true : false}
      type="button"
      variant="destructive"
      className="text-xs h-8 md:h-10 md:text-sm"
      onClick={handleDesableEvent}
    >
      {isPending ? (
        <Loader2 height={10} width={10} className="animate-spin" />
      ) : (
        <CalendarX2Icon height={15} width={15} />
      )}
    </Button>
  );
};

export default ButtonDeactivate;
