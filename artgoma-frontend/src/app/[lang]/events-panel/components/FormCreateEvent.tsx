"use client";

import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import SubmitButtonCreateEvent from "./SubmitButtonCreateEvent";
import { addEvent } from "@/actions/event";
import { toast } from "@/hooks/use-toast";
import { UploadFilesRoute } from "./FormUploadImage";

const FormCreateEvent = () => {
  const initialState = { message: "", status: undefined };
  const [state, formAction] = useFormState(addEvent, initialState);

  const [imagesToUpload, setImagesToUpload] = useState<string[]>([]);

  useEffect(() => {
    if (state.status === "success") {
      toast({
        variant: "default",
        title: "Successful",
        description: "Event created succesfuly!",
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
    <form action={formAction} className="flex flex-col w-full">
      <input type="text" hidden value={JSON.stringify(imagesToUpload)} name="images" onChange={() => {}} />

      <div>
        <label className="text-white pl-2 text-xs text-primary" htmlFor="name">
          Event name
        </label>
        <input
          required
          className="border pl-2 py-1 rounded-md w-full h-8 text-xs md:text-base text-[#383529] border-primary"
          placeholder="Event name"
          type="text"
          name="name"
          id="name"
          autoComplete="off"
        />
      </div>

      <div className="flex gap-2">
        <div className="flex-1">
          <label className="text-white pl-2 text-xs text-primary" htmlFor="date">
            Date
          </label>
          <input
            type="datetime-local"
            id="datetime"
            name="datetime"
            required
            className="border border-black rounded-md p-1 w-full"
          />
        </div>
      </div>

      <div>
        <label className="text-white pl-2 text-xs text-primary" htmlFor="place">
          Place
        </label>
        <input
          required
          className="border pl-2 py-1 rounded-md w-full h-8 text-xs md:text-base text-[#383529] border-primary"
          placeholder="Place"
          type="text"
          name="place"
          id="place"
          autoComplete="off"
        />
      </div>

      <div>
        <label className="text-white pl-2 text-xs text-primary" htmlFor="description">
          Description
        </label>
        <textarea
          className="border pl-2 py-1 rounded-md w-full h-20 text-xs md:text-base text-[#383529] border-primary"
          placeholder="Description"
          name="description"
          id="description"
          autoComplete="off"
        />
      </div>
      <UploadFilesRoute setImagesToUpload={setImagesToUpload} imagesToUpload={imagesToUpload} />

      <SubmitButtonCreateEvent imagesToUpload={imagesToUpload} />
    </form>
  );
};

export default FormCreateEvent;
