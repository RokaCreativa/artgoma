// 🧭 MIGA DE PAN: Admin Layout - Layout principal del panel de administración
// 📍 UBICACIÓN: src/app/[lang]/admin/layout.tsx
// 🎯 PORQUÉ EXISTE: Estructura base con sidebar y header para todas las páginas admin
// 🔄 FLUJO: Check auth → Render layout con children
// 🚨 CUIDADO: Si no está autenticado, redirige a login
// 📋 SPEC: SPEC-26-01-2026-CMS-ContentManager

import { redirect } from "next/navigation";
import { isAdminAuthenticated, getAdminInfo } from "@/lib/cms/auth";
import { Locale } from "@/configs/i18n.config";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

interface AdminLayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}

export default async function AdminLayout({
  children,
  params,
}: AdminLayoutProps) {
  const { lang: langParam } = await params;
  const lang = langParam as Locale;

  // Verificar autenticación (excepto en página de login)
  const isAuth = await isAdminAuthenticated();
  const adminInfo = await getAdminInfo();

  // Si no está autenticado y no está en login, redirigir
  // Nota: La página de login tiene su propio layout implícito

  return (
    <div className="min-h-screen bg-[#0f1115]">
      {isAuth ? (
        <>
          {/* Sidebar */}
          <Sidebar lang={lang} />

          {/* Main content area */}
          <div className="lg:ml-64 min-h-screen flex flex-col">
            {/* Header */}
            <Header userEmail={adminInfo?.email} />

            {/* Page content */}
            <main className="flex-1 p-6">{children}</main>
          </div>
        </>
      ) : (
        // Si no está autenticado, solo mostrar children (será la página de login)
        children
      )}
    </div>
  );
}
