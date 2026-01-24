"use client";

import { useEffect, useRef, useState } from "react";
import { useDictionary } from "@/providers/DictionaryProvider";
import ButtonSubmit from "../../components/ButtonSubmit";
import { useFormState } from "react-dom";
import { type State } from "@/types/state";
import { useRouter } from "next/navigation";
import GuestsInput, { Person } from "../../confirm/components/GuestsInput";
import { DateSelector } from "../../confirm/components/DateSelector";
import TimeSelector from "../../confirm/components/TimeSelector";
import confirmWithoutAuth from "@/actions/confirmWithoutAuth";
import { toast } from "@/hooks/use-toast";

const FormConfirmWithoutAuth = ({
  eventId,
  collaboratorCode,
}: {
  eventId?: number;
  collaboratorCode: string | null;
}) => {
  const router = useRouter();
  const initialState: State = { message: "", status: undefined };
  const [state, formAction] = useFormState(confirmWithoutAuth, initialState);
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
        description: "Confirmation successfully added!",
      });
    } else if (state.status === "error") {
      toast({
        variant: "destructive",
        title: "Erros",
        description: `There was an error! ${state.message}`,
      });
    }
  }, [state]);

  return (
    <div className="relative z-50 flex flex-col">
      <form ref={ref} action={formAction} className="flex flex-col w-full">
        <input type="text" hidden defaultValue={collaboratorCode ?? ""} name="collaborator" />
        <input type="text" hidden defaultValue={eventId ?? ""} name="eventId" />
        <input type="text" hidden value={JSON.stringify(inputList)} name="companions" onChange={() => {}} />
        <input type="text" hidden name="date" value={selectedDate ?? ""} onChange={() => {}} />
        <input type="text" hidden name="time" value={selectedTime ?? ""} onChange={() => {}} />

        <div>
          <label className="pl-2 text-xs text-primary" htmlFor="name">
            {form.labels.name}
          </label>
          <input
            required
            className="border pl-2 py-1 rounded-md w-full h-8 text-xs md:text-base text-[#383529] border-primary"
            placeholder={form.placeHolder.name}
            min={2}
            type="text"
            name="name"
            id="name"
            autoComplete="name"
          />
        </div>
        <div>
          <label className="pl-2 text-xs text-primary" htmlFor="email">
            {form.labels.email}
          </label>
          <input
            required
            className="border pl-2 py-1 rounded-md w-full h-8 text-xs md:text-base text-[#383529] border-primary"
            placeholder={form.placeHolder.email}
            min={2}
            type="email"
            name="email"
            id="email"
            autoComplete="email"
          />
        </div>
        <div>
          <label className="pl-2 text-xs text-primary" htmlFor="phone">
            {form.labels.phone}
          </label>
          <input
            required
            className="border pl-2 py-1 rounded-md w-full h-8 text-xs md:text-base text-[#383529] border-primary"
            placeholder={form.placeHolder.phone}
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

export default FormConfirmWithoutAuth;
