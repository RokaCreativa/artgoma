// 🧭 MIGA DE PAN: Supabase Admin Client - Cliente con Service Role Key para operaciones del servidor
// 📍 UBICACIÓN: src/lib/supabase-admin.ts
// 🎯 PORQUÉ EXISTE: Bypasear RLS para uploads desde el servidor (APIs)
// 🔄 FLUJO: API routes → ESTE CLIENTE → Supabase Storage (sin RLS)
// 🚨 CUIDADO: NUNCA exponer en cliente - solo usar en server-side (API routes, server actions)
// 📋 SPEC: SPEC-26-01-2026-CMS-ContentManager

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.warn(
    '⚠️ SUPABASE_SERVICE_ROLE_KEY not configured. Server uploads will fail with RLS errors.'
  )
}

/**
 * Cliente de Supabase con Service Role Key
 * - Bypasea Row Level Security (RLS)
 * - SOLO usar en server-side (API routes, server actions)
 * - NUNCA exponer en cliente
 */
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})
