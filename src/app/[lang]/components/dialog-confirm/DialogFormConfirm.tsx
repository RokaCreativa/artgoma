import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import FormConfirmWithoutAuth from "./FormConfirmWithoutAuth";
import { cookies } from "next/headers";
import type { UIContent } from "@/lib/cms/sectionSchemas";

interface DialogFormConfirmProps {
  lang: string;
  eventId?: number;
  ui?: UIContent;
}

const DialogFormConfirm = async ({ lang, eventId, ui }: DialogFormConfirmProps) => {
  const cookieStore = await cookies();
  const collaborator = cookieStore.get("collaborator");
  const code = collaborator?.name === "collaborator" ? collaborator.value : null;

  return (
    <Dialog>
      <DialogTrigger className={cn(buttonVariants({ variant: "default" }))}>
        {ui?.dialog?.withoutAuth ?? "Without Authentication"}
      </DialogTrigger>
      <DialogContent className="shadow-red-600/50 shadow-xl max-h-screen overflow-hidden overflow-y-scroll">
        <DialogHeader>
          <DialogTitle className="text-center">
            {ui?.dialog?.withoutAuthTitle ?? "Confirm without authentication?"}
          </DialogTitle>
        </DialogHeader>
        <FormConfirmWithoutAuth collaboratorCode={code} eventId={eventId} />
      </DialogContent>
    </Dialog>
  );
};

export default DialogFormConfirm;
