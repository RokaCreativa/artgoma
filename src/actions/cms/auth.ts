// 🧭 MIGA DE PAN: Auth Server Actions - Login/Logout para CMS
// 📍 UBICACIÓN: src/actions/cms/auth.ts
// 🎯 PORQUÉ EXISTE: Manejar login/logout desde formularios
// 🔄 FLUJO: Form submit → Server Action → Cookie → Redirect
// 📋 SPEC: SPEC-26-01-2026-CMS-ContentManager

"use server";

import { redirect } from "next/navigation";
import {
  validateAdminCredentials,
  createAdminSession,
  destroyAdminSession
} from "@/lib/cms/auth";

export type LoginState = {
  success: boolean;
  error?: string;
};

/**
 * Acción de login
 */
export async function loginAction(
  prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { success: false, error: "Email y contraseña son requeridos" };
  }

  const isValid = validateAdminCredentials(email, password);

  if (!isValid) {
    return { success: false, error: "Credenciales inválidas" };
  }

  await createAdminSession();

  // Redirect después de login exitoso
  redirect("/es/admin");
}

/**
 * Acción de logout
 */
export async function logoutAction() {
  await destroyAdminSession();
  redirect("/es/admin/login");
}
