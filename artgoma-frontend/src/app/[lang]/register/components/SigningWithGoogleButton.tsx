"use client";

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import Image from "next/image";
import React from "react";

const SigningWithGoogleButton = ({ redirect }: { redirect?: string | null }) => {
  return (
    <Button
      className="flex gap-4 justify-around border-red-500 border rounded-3xl"
      type="button"
      onClick={() =>
        signIn("google", {
          callbackUrl: redirect ? `/events/${redirect}` : "/",
          redirect: false,
        })
      }
    >
      <Image src={"/google-svgrepo-com.svg"} alt="google icon" height={20} width={20} /> Login with Google
    </Button>
  );
};

export default SigningWithGoogleButton;
