// 🧭 MIGA DE PAN: CMS Auth - Sistema de autenticación temporal hardcodeado
// 📍 UBICACIÓN: src/lib/cms/auth.ts
// 🎯 PORQUÉ EXISTE: Proteger panel admin con login simple mientras desarrollamos
// 🔄 FLUJO: Login → validateCredentials → setCookie → protectedRoutes
// 🚨 CUIDADO: Este es un auth TEMPORAL - reemplazar con NextAuth después
// 📋 SPEC: SPEC-26-01-2026-CMS-ContentManager

import { cookies } from "next/headers";

// Credenciales hardcodeadas (TEMPORAL - cambiar a NextAuth después)
const ADMIN_EMAIL = "kl@roka.es";
const ADMIN_PASSWORD = "Test1234";
const SESSION_COOKIE_NAME = "artgoma_admin_session";
const SESSION_SECRET = "artgoma-cms-temp-secret-2026"; // En producción usar env var

/**
 * Valida las credenciales del admin
 */
export function validateAdminCredentials(email: string, password: string): boolean {
  return email === ADMIN_EMAIL && password === ADMIN_PASSWORD;
}

/**
 * Crea una sesión de admin (cookie simple)
 */
export async function createAdminSession(): Promise<void> {
  const cookieStore = await cookies();

  // Token simple (en producción usar JWT)
  const sessionToken = Buffer.from(`${ADMIN_EMAIL}:${Date.now()}:${SESSION_SECRET}`).toString('base64');

  cookieStore.set(SESSION_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 días
    path: "/",
  });
}

/**
 * Destruye la sesión de admin
 */
export async function destroyAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

/**
 * Verifica si hay una sesión de admin activa
 */
export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

  if (!sessionCookie?.value) {
    return false;
  }

  try {
    // Decodificar y verificar el token
    const decoded = Buffer.from(sessionCookie.value, 'base64').toString('utf-8');
    const [email, timestamp, secret] = decoded.split(':');

    // Verificar que el secret coincide y el email es correcto
    if (secret !== SESSION_SECRET || email !== ADMIN_EMAIL) {
      return false;
    }

    // Verificar que no ha expirado (7 días)
    const sessionTime = parseInt(timestamp, 10);
    const now = Date.now();
    const maxAge = 60 * 60 * 24 * 7 * 1000; // 7 días en ms

    if (now - sessionTime > maxAge) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * Obtiene info del admin actual (para mostrar en UI)
 */
export async function getAdminInfo(): Promise<{ email: string } | null> {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) return null;

  return { email: ADMIN_EMAIL };
}
