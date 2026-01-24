"use client";

import { enableEvent } from "@/actions/event";
import { Button } from "@/components/ui/button";
import { Calendar, Loader2, ToggleLeft } from "lucide-react";
import { usePathname } from "next/navigation";
import { useTransition } from "react";

const ButtonActivate = ({
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
        const data = await enableEvent({ id: event.id, path: pathName });
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
      variant="secondary"
      className="text-xs h-8 md:h-10 md:text-sm"
      onClick={handleDesableEvent}
    >
      {isPending ? <Loader2 height={10} width={10} className="animate-spin" /> : <Calendar height={15} width={15} />}
    </Button>
  );
};

export default ButtonActivate;
