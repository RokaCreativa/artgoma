import Link from "next/link";
import FormRegister from "./components/FormRegister";
import SigningWithGoogleButton from "./components/SigningWithGoogleButton";
import { Locale } from "@/configs/i18n.config";
type SearchParams = { redirect: string | undefined };

const RegisterPage = ({
  params: { lang },
  searchParams,
}: {
  params: { lang: Locale };
  searchParams?: SearchParams;
}) => {
  const redirect = searchParams ? searchParams.redirect : null;

  return (
    <div className="flex flex-col items-center bg-white p-10 rounded-xl border-red-600 border">
      <p className="font-semibold">Create New Account</p>
      <FormRegister redirect={redirect} />

      <p className="text-center py-1">or</p>
      <SigningWithGoogleButton redirect={redirect} />
      <p className="text-sm text-center mt-4">Back to login:</p>
      <Link
        className="text-blue-500 font-semibold hover:underline"
        href={redirect ? `/${lang}/login?redirect=${redirect}` : "/login"}
      >
        Back to Login here
      </Link>
    </div>
  );
};

export default RegisterPage;
