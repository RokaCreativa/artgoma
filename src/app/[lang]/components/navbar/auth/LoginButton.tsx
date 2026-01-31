"use client";

import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { signIn } from "next-auth/react";
import { useDictionary } from "@/providers/DictionaryProvider";

const LoginButton = () => {
  const { ui } = useDictionary();

  return (
    <Button className="gap-3" variant={"outline"} onClick={() => signIn()}>
      <span>{ui?.auth?.login ?? "Login"}</span> <LogIn className="h-4 w-4" />
    </Button>
  );
};

export default LoginButton;
