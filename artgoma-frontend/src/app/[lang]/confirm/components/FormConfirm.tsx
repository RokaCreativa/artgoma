"use client";

import { useEffect, useRef, useState } from "react";
import GuestsInput, { Person } from "./GuestsInput";
import TimeSelector from "./TimeSelector";
import { DateSelector } from "./DateSelector";
import { useDictionary } from "@/providers/DictionaryProvider";
import ButtonSubmit from "../../components/ButtonSubmit";
import { useFormState } from "react-dom";
import { type State } from "@/types/state";
import addConfirmations from "@/actions/visit";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

const FormConfirm = ({ collaborator }: { collaborator?: string }) => {
  const router = useRouter();
  const initialState: State = { message: "", status: undefined };
  const [state, formAction] = useFormState(addConfirmations, initialState);
  const session = useSession();
  const [inputList, setInputList] = useState<Person[]>([]);
  const ref = useRef<HTMLFormElement>(null);
  const inputRef: any = useRef<HTMLInputElement>(null);
  const { form } = useDictionary();

  const [selectedDate, setSelectedDate] = useState<any>();
  const [selectedTime, setSelectedTime] = useState<string>("");

  useEffect(() => {
    if (state.status === "success") {
      toast({
        variant: "default",
        title: "Successful",
        description: "Confirmation submited succesfuly!",
      });
    } else if (state.status === "error") {
      toast({
        variant: "destructive",
        title: "Erros",
        description: `Unexpected error. ${state.message}`,
      });
    }
  }, [state]);

  return (
    <div className="relative z-50 flex flex-col p-4 md:p-6 rounded-xl bg-white backdrop-blur-3xl shadow-xl shadow-gray-800">
      <div className="flex flex-col w-full mb-4">
        <p className="text-md md:text-2xl text-center">{form.title}</p>
      </div>

      <form ref={ref} action={formAction} className="flex flex-col w-full">
        <input type="text" hidden defaultValue={collaborator ?? ""} name="collaborator" />
        <input type="text" hidden defaultValue={session.data?.user.id} name="userId" />
        <input type="text" hidden defaultValue={JSON.stringify(inputList)} name="companions" />
        <input type="text" hidden name="date" defaultValue={selectedDate ?? ""} />
        <input type="text" hidden name="time" defaultValue={selectedTime ?? ""} />

        <div>
          <label hidden={session.data?.user.phone ? true : false} className="pl-2 text-xs text-primary" htmlFor="phone">
            {form.labels.phone}
          </label>
          <input
            required
            hidden={session.data?.user.phone ? true : false}
            className="border pl-2 py-1 rounded-md w-full h-8 text-xs md:text-base text-[#383529] border-primary"
            placeholder={form.placeHolder.phone}
            defaultValue={session.data?.user.phone ?? ""}
            min={2}
            type="tel"
            name="phone"
            id="phone"
            autoComplete="tel"
          />
        </div>

        <div className="flex gap-2">
          <div className="flex-1">
            <label className="pl-2 text-xs text-primary" htmlFor="date">
              {form.labels.day}
            </label>
            <DateSelector inputRef={inputRef} selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
          </div>
          <div className="flex-1">
            <label className="text-xs text-primary" htmlFor="time">
              {form.labels.time}
            </label>
            <TimeSelector selectedDate={selectedDate} setSelectedTime={setSelectedTime} />
          </div>
        </div>

        <div>
          <label className="pl-2 text-xs text-primary" htmlFor="company">
            {form.labels.company}
          </label>
          <input
            className="border pl-2 py-1 rounded-md w-full h-8 text-xs md:text-base text-[#383529] border-primary"
            placeholder={form.placeHolder.company}
            min={2}
            type="text"
            name="company"
            id="company"
            autoComplete="off"
          />
        </div>
        <div className="mt-2">
          <GuestsInput inputList={inputList} setInputList={setInputList} />
        </div>

        <ButtonSubmit text={form.buttons.confirm} />
      </form>
    </div>
  );
};

export default FormConfirm;
