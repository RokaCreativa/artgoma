"use client";

import React, { useEffect } from "react";
import ButtonSubmit from "../../components/ButtonSubmit";
import { State } from "@/types/state";
import { useFormState } from "react-dom";
import registerUser from "@/actions/auth";
import { useRouter } from "next/navigation";

const FormRegister = ({ redirect }: { redirect?: string | null }) => {
  const initialState: State = { message: "", status: undefined };
  const [state, formAction] = useFormState(registerUser, initialState);
  const router = useRouter();

  useEffect(() => {
    if (state.status === "success") {
      router.push(redirect ? `/events/${redirect}` : "/login");
    }
  }, [state]);

  return (
    <form action={formAction} className="flex flex-col w-full">
      <div className="flex gap-2">
        <div className="flex flex-col w-full">
          <label className="pl-2 text-xs text-primary" htmlFor="name">
            Full name
          </label>
          <input
            required
            className="border pl-2 py-1 rounded-md h-8 text-xs md:text-base text-[#383529] border-primary"
            placeholder="Full name"
            min={2}
            type="text"
            name="name"
            id="name"
            autoComplete="name"
          />
        </div>
      </div>
      <div>
        <label className="pl-2 text-xs text-primary" htmlFor="email">
          email
        </label>
        <input
          required
          className="border pl-2 py-1 rounded-md w-full h-8 text-xs md:text-base text-[#383529] border-primary"
          placeholder="email"
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
          placeholder="phone"
          min={2}
          type="tel"
          name="phone"
          id="phone"
          autoComplete="tel"
        />
      </div>
      <div>
        <label className="pl-2 text-xs text-primary" htmlFor="password">
          Password
        </label>
        <input
          required
          className="border pl-2 py-1 rounded-md w-full h-8 text-xs md:text-base text-[#383529] border-primary"
          placeholder="Password"
          min={8}
          type="password"
          name="password"
          id="password"
          autoComplete="new-password"
        />
      </div>
      <div>
        <label className="pl-2 text-xs text-primary" htmlFor="repassword">
          Confirm Password
        </label>
        <input
          required
          className="border pl-2 py-1 rounded-md w-full h-8 text-xs md:text-base text-[#383529] border-primary"
          placeholder="Confirm Password"
          type="password"
          name="repassword"
          id="repassword"
          autoComplete="new-password"
        />
      </div>

      <ButtonSubmit text={"Register"} />
    </form>
  );
};

export default FormRegister;
