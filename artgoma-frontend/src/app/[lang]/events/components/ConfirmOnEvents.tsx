import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import DialogFormConfirm from "../../components/dialog-confirm/DialogFormConfirm";

const ConfirmOnEvents = ({ lang, redirect, eventId }: { lang: string; redirect?: string; eventId: number }) => {
  return (
    <Dialog>
      <DialogTrigger className="max-w-36 shadow-md hover:shadow-red-500 transition-shadow duration-300 relative inline-flex h-10 overflow-hidden rounded-full p-[1.5px] focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-gray-50">
        <span className="absolute inset-[-1000%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#ffc6c6_0%,#ff0505_50%,#ff9999_100%)]" />
        <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-gray-950 px-8 py-1 text-sm font-medium text-gray-50 backdrop-blur-3xl">
          Confrm
        </span>
      </DialogTrigger>
      <DialogContent className="shadow-red-600/50 shadow-xl">
        <DialogHeader>
          <DialogTitle className="mb-4 text-center">How would you like to confirm?</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col md:flex-row items-center justify-center gap-2">
          <Link className={cn(buttonVariants({ variant: "default" }))} href={`/${lang}/login?redirect=${redirect}`}>
            Login first
          </Link>
          <span className="font-semibold">or</span>
          <DialogFormConfirm lang={lang} eventId={eventId} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmOnEvents;
