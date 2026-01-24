import Link from "next/link";
import React from "react";
import LoginForm from "./components/LoginForm";
import SigninButton from "./components/SigninButton";
import { Locale } from "@/configs/i18n.config";
type SearchParams = { redirect: string | undefined };

const LoginPage = ({ params: { lang }, searchParams }: { params: { lang: Locale }; searchParams?: SearchParams }) => {
  const redirect = searchParams ? searchParams.redirect : null;

  return (
    <div className="flex flex-col items-center bg-white p-10 rounded-xl border-red-600 border">
      <p className="font-semibold">Login</p>
      <LoginForm redirect={redirect} />

      <p className="text-center py-1">or</p>
      <SigninButton redirect={redirect} />

      <p className="text-sm text-center mt-4">Create new acount.</p>
      <Link
        className="text-blue-500 font-semibold hover:underline"
        href={redirect ? `/${lang}/register?redirect=${redirect}` : `/${lang}/register`}
      >
        New Account
      </Link>
    </div>
  );
};

export default LoginPage;
