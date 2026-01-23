import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import DialogTriggerWrapper from "./DialogTriggerWrapper";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import DialogFormConfirm from "./DialogFormConfirm";
import { getDictionary } from "@/configs/dictionary";
import { Locale } from "@/configs/i18n.config";

const DialogConfirm = async ({ lang }: { lang: Locale }) => {
  const { home } = await getDictionary(lang);
  return (
    <Dialog>
      <DialogTriggerWrapper text={home.button} />
      <DialogContent className="shadow-red-600/50 shadow-xl">
        <DialogHeader>
          <DialogTitle className="mb-4 text-center">How would you like to confirm?</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col md:flex-row items-center justify-center gap-2">
          <Link className={cn(buttonVariants({ variant: "default" }))} href={`/${lang}/confirm`}>
            With Authentication
          </Link>
          <span className="font-semibold">or</span>
          <DialogFormConfirm lang={lang} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DialogConfirm;
