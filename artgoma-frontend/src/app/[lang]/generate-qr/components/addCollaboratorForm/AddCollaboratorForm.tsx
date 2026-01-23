"use client";

import { useFormState } from "react-dom";
import { type State } from "@/types/state";
import { addCollaborator } from "@/actions/collaborator";
import ButtonSubmit from "@/app/[lang]/components/ButtonSubmit";
import { useEffect } from "react";
import { toast } from "@/hooks/use-toast";

const AddCollaboratorsForm = () => {
  const initialState: State = { message: "", status: undefined };
  const [state, formAction] = useFormState(addCollaborator, initialState);

  useEffect(() => {
    // Limpiar el formulario si el estado es exitoso
    if (state.status === "success") {
      toast({
        variant: "default",
        title: "Successful",
        description: "Collaborator created succesfuly!",
      });
      // Restablecer los campos del formulario
      const form = document.querySelector("form");
      if (form) {
        form.reset();
      }
    } else if (state.status === "error") {
      toast({
        variant: "destructive",
        title: "Erros",
        description: `Unexpected error. ${state.message}`,
      });
    }
  }, [state]);

  return (
    <div className="relative z-50 flex flex-col  p-4 md:p-6">
      <div className="flex flex-col w-full mb-4">
        <p className="text-md md:text-2xl text-center">Add collaborators here</p>
      </div>

      <form action={formAction} className="flex flex-col w-full">
        <div className="flex flex-col">
          <label className="pl-2 text-xs text-primary" htmlFor="name">
            name
          </label>
          <input
            required
            className="border pl-2 py-1 rounded-md h-8 text-xs md:text-base text-[#383529] border-primary"
            placeholder={"name"}
            min={2}
            type="text"
            name="name"
            id="name"
            autoComplete="name"
          />
        </div>
        <div className="flex flex-col">
          <label className="pl-2 text-xs text-primary" htmlFor="company">
            company
          </label>
          <input
            required
            className="border pl-2 py-1 rounded-md h-8 text-xs md:text-base text-[#383529] border-primary"
            placeholder={"company"}
            min={2}
            type="text"
            name="company"
            id="company"
            autoComplete="company"
          />
        </div>
        <div className="flex flex-col">
          <label className="pl-2 text-xs text-primary" htmlFor="slogan">
            slogan
          </label>
          <input
            required
            className="border pl-2 py-1 rounded-md w-full h-8 text-xs md:text-base text-[#383529] border-primary"
            placeholder={"slogan"}
            min={2}
            type="text"
            name="slogan"
            id="slogan"
            autoComplete="none"
          />
        </div>

        <div>
          <label className="pl-2 text-xs text-primary" htmlFor="email">
            email
          </label>
          <input
            required
            className="border pl-2 py-1 rounded-md w-full h-8 text-xs md:text-base text-[#383529] border-primary"
            placeholder={"email"}
            min={2}
            type="email"
            name="email"
            id="email"
            autoComplete="email"
          />
        </div>
        <div>
          <label className="pl-2 text-xs text-primary" htmlFor="phone">
            phone
          </label>
          <input
            required
            className="border pl-2 py-1 rounded-md w-full h-8 text-xs md:text-base text-[#383529] border-primary"
            placeholder={"phone"}
            min={2}
            type="tel"
            name="phone"
            id="phone"
            autoComplete="tel"
          />
        </div>

        <div>
          <label className="pl-2 text-xs text-primary" htmlFor="address">
            address (optional)
          </label>
          <input
            className="border pl-2 py-1 rounded-md w-full h-8 text-xs md:text-base text-[#383529] border-primary"
            placeholder={"address"}
            min={2}
            type="text"
            name="address"
            id="address"
            autoComplete="off"
          />
        </div>
        <div className="flex justify-center mt-4">
          <ButtonSubmit text="Add collaborator" />
        </div>
      </form>
    </div>
  );
};

export default AddCollaboratorsForm;
