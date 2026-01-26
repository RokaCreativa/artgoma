// 🧭 MIGA DE PAN: Admin Login Page - Página de login para el CMS
// 📍 UBICACIÓN: src/app/[lang]/admin/login/page.tsx
// 🎯 PORQUÉ EXISTE: Autenticar usuarios admin antes de acceder al panel
// 🔄 FLUJO: Form → loginAction → Cookie → Redirect /admin
// 📋 SPEC: SPEC-26-01-2026-CMS-ContentManager

"use client";

import { useActionState } from "react";
import { loginAction, LoginState } from "@/actions/cms/auth";
import { Button } from "@/components/ui/button";
import { Loader2, Lock } from "lucide-react";
import Image from "next/image";

const initialState: LoginState = {
  success: false,
};

export default function AdminLoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, initialState);

  return (
    <div className="min-h-screen bg-[#1c1f24] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Image
            src="/Logo Goma horizontal.svg"
            alt="ArtGoMA"
            width={200}
            height={60}
            className="opacity-90"
          />
        </div>

        {/* Card de login */}
        <div className="bg-[#2a2d35] rounded-2xl p-8 shadow-2xl border border-gray-700/50">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Lock className="w-5 h-5 text-red-500" />
            <h1 className="text-xl font-semibold text-white">Panel de Administración</h1>
          </div>

          <form action={formAction} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                autoComplete="email"
                className="w-full px-4 py-3 bg-[#1c1f24] border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                placeholder="tu@email.com"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                autoComplete="current-password"
                className="w-full px-4 py-3 bg-[#1c1f24] border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                placeholder="••••••••"
              />
            </div>

            {/* Error message */}
            {state.error && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-3">
                <p className="text-red-400 text-sm text-center">{state.error}</p>
              </div>
            )}

            {/* Submit button */}
            <Button
              type="submit"
              disabled={isPending}
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition-colors disabled:opacity-50"
            >
              {isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Entrando...
                </span>
              ) : (
                "Entrar"
              )}
            </Button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-6">
          ArtGoMA Content Manager
        </p>
      </div>
    </div>
  );
}
