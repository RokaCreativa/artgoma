import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import FormConfirmWithoutAuth from "./FormConfirmWithoutAuth";
import { cookies } from "next/headers";

const DialogFormConfirm = ({ lang, eventId }: { lang: string; eventId?: number }) => {
  const cookieStore = cookies();
  const collaborator = cookieStore.get("collaborator");
  const code = collaborator?.name === "collaborator" ? collaborator.value : null;

  return (
    <Dialog>
      <DialogTrigger className={cn(buttonVariants({ variant: "default" }))}>Without Authentication</DialogTrigger>
      <DialogContent className="shadow-red-600/50 shadow-xl max-h-screen overflow-hidden overflow-y-scroll">
        <DialogHeader>
          <DialogTitle className="text-center">Confirm without authentication?</DialogTitle>
        </DialogHeader>
        <FormConfirmWithoutAuth collaboratorCode={code} eventId={eventId} />
      </DialogContent>
    </Dialog>
  );
};

export default DialogFormConfirm;
