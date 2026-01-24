"use client";

import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import ButtonSubmit from "../../components/ButtonSubmit";
import { useRouter } from "next/navigation";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginForm = ({ redirect }: { redirect?: string | null }) => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    const result = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
      callbackUrl: redirect ? `/events/${redirect}` : "/",
    });

    if (result?.error) {
      console.error("Login failed:", result.error);
      alert("Invalid credentials");
    } else {
      alert("Login successful!");
      router.push("/");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} name="login form" className="flex flex-col gap-2">
      <div className="flex flex-col">
        <label className="pl-2 text-xs text-primary" htmlFor="email">
          Email
        </label>
        <input
          {...register("email")}
          className={`border pl-2 py-1 rounded-md h-8 text-xs md:text-base text-[#383529] border-primary ${
            errors.email ? "border-red-500" : ""
          }`}
          autoComplete="none"
          type="email"
          placeholder="Email"
        />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
      </div>
      <div className="flex flex-col">
        <label className="pl-2 text-xs text-primary" htmlFor="password">
          Password
        </label>
        <input
          {...register("password")}
          type="password"
          className={`border pl-2 py-1 rounded-md h-8 text-xs md:text-base text-[#383529] border-primary ${
            errors.password ? "border-red-500" : ""
          }`}
          autoComplete="none"
          placeholder="Password"
        />
        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
      </div>

      <ButtonSubmit text={isSubmitting ? "Logging in..." : "Login"} />
    </form>
  );
};

export default LoginForm;
