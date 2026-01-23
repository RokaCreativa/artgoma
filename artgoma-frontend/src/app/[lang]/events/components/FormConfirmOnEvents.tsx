"use client";

import React, { useEffect, useState } from "react";
import GuestsInput, { Person } from "../../confirm/components/GuestsInput";
import { Session } from "next-auth";
import { useFormState, useFormStatus } from "react-dom";
import { State } from "@/types/state";
import addConfirmations from "@/actions/visit";
import { IEvent } from "@/queries/getEventBySlug";

import { useRouter } from "next/navigation";

import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button
      className="my-2 max-w-32 bg-black/70 border-2 border-red-700 hover:bg-black/60 rounded-full p-2"
      type="submit"
      disabled={pending ? true : false}
    >
      <span className="font-semibold text-white">
        {pending ? <Loader2 className="animate-spin" /> : <span>Confirm</span>}
      </span>
    </button>
  );
}

const FormConfirmOnEvents = ({ session, event }: { session: Session; event: IEvent }) => {
  const router = useRouter();
  const initialState: State = { message: "", status: undefined };
  const [state, formAction] = useFormState(addConfirmations, initialState);
  const [inputList, setInputList] = useState<Person[]>([]);

  useEffect(() => {
    if (state.status === "success") {
      toast({
        variant: "default",
        title: "Successful",
        description: "Confirmation submited succesfuly!",
      });
      router.push("/");
    } else if (state.status === "error") {
      toast({
        variant: "destructive",
        title: "Erros",
        description: `Unexpected error. ${state.message}`,
      });
    }
  }, [state]);

  return (
    <div>
      <form className="flex flex-col gap-2" action={formAction}>
        <input name="userId" type="text" hidden defaultValue={session?.user.id} />
        <input name="eventId" type="text" hidden defaultValue={event.id} />
        <input type="text" hidden defaultValue={JSON.stringify(inputList)} name="companions" />
        <input type="text" hidden name="date" defaultValue={new Date(event.date).toISOString()} />

        <div className="flex flex-col">
          <label hidden={session.user.phone ? true : false} className="text-xs pl-2" htmlFor="phone">
            Phone
          </label>

          <input
            required
            hidden={session.user.phone ? true : false}
            className="border rounded-md pl-2 text-sm h-8"
            name="phone"
            type="text"
            placeholder="Phone number"
            defaultValue={session.user.phone ?? ""}
          />
        </div>
        <Submit />
        <div className="max-w-full md:max-w-[75%] lg:max-w-[50%]">
          <GuestsInput inputList={inputList} setInputList={setInputList} />
        </div>
      </form>
    </div>
  );
};

export default FormConfirmOnEvents;
