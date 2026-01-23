"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import React from "react";
import { useFormStatus } from "react-dom";

interface iButtonProps {
  text: string;
  variant?: "default" | "ghost" | "outline" | "secondary";
  error?: any;
}

const ButtonSubmit = ({ text, variant, error }: iButtonProps) => {
  const { pending } = useFormStatus();

  return (
    <Button
      variant={variant ?? null}
      className={cn(!variant && "my-2 bg-black/70 border-2 border-red-700 hover:bg-black/60 rounded-full p-2")}
      type="submit"
      disabled={pending || error ? true : false}
    >
      <span className="font-semibold text-white">
        {!pending ? `${text}` : <Loader2 className="animate-spin stroke-white" />}
      </span>
    </Button>
  );
};

export default ButtonSubmit;
