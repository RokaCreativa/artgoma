// 🧭 MIGA DE PAN: Debug Supabase - Endpoint temporal para diagnosticar config
// ⚠️ ELIMINAR DESPUÉS DE DEBUGGEAR
// 📋 SPEC: SPEC-26-01-2026-CMS-ContentManager

import { NextResponse } from "next/server";

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

  return NextResponse.json({
    supabase_url: {
      configured: !!supabaseUrl,
      length: supabaseUrl.length,
      preview: supabaseUrl ? supabaseUrl.substring(0, 30) + '...' : 'NOT SET'
    },
    anon_key: {
      configured: !!anonKey,
      length: anonKey.length,
      // Solo mostrar si empieza con "eyJ" (JWT válido)
      valid_jwt: anonKey.startsWith('eyJ')
    },
    service_role_key: {
      configured: !!serviceRoleKey,
      length: serviceRoleKey.length,
      // Solo mostrar si empieza con "eyJ" (JWT válido)
      valid_jwt: serviceRoleKey.startsWith('eyJ')
    },
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
}
