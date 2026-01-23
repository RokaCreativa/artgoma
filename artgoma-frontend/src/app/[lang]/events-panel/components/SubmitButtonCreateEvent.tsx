import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

import { useFormStatus } from "react-dom";

const SubmitButtonCreateEvent = ({ imagesToUpload }: { imagesToUpload: string[] }) => {
  const { pending, data } = useFormStatus();
  return (
    <Button
      className={"my-2 bg-black/70 border-2 border-red-700 hover:bg-black/60 rounded-full p-2"}
      type="submit"
      disabled={!imagesToUpload.length ? true : false}
    >
      <span className="font-semibold text-white">
        {!pending ? "Create Event" : <Loader2 className="animate-spin stroke-white" />}
      </span>
    </Button>
  );
};

export default SubmitButtonCreateEvent;
