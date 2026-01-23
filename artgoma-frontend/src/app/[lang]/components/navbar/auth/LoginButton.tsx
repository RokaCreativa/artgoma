"use client";

import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { signIn } from "next-auth/react";

const LoginButton = () => {
  return (
    <Button className="gap-3" variant={"outline"} onClick={() => signIn()}>
      <span>Login</span> <LogIn className="h-4 w-4" />
    </Button>
  );
};

export default LoginButton;
