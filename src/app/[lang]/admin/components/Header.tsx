// 🧭 MIGA DE PAN: Admin Header - Barra superior del panel admin
// 📍 UBICACIÓN: src/app/[lang]/admin/components/Header.tsx
// 🎯 PORQUÉ EXISTE: Mostrar info del usuario y botón de logout
// 🔄 FLUJO: Display user → Click logout → logoutAction
// 📋 SPEC: SPEC-26-01-2026-CMS-ContentManager

"use client";

import { LogOut, User } from "lucide-react";
import { logoutAction } from "@/actions/cms/auth";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  userEmail?: string;
}

export default function Header({ userEmail }: HeaderProps) {
  return (
    <header className="h-16 bg-[#1c1f24] border-b border-gray-800 flex items-center justify-between px-6">
      {/* Title area - can be dynamic based on page */}
      <div>
        <h1 className="text-white font-medium">Panel de Administración</h1>
      </div>

      {/* User area */}
      <div className="flex items-center gap-4">
        {/* User info */}
        <div className="flex items-center gap-2 text-gray-400">
          <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
            <User className="w-4 h-4" />
          </div>
          <span className="text-sm hidden sm:block">{userEmail || "Admin"}</span>
        </div>

        {/* Logout button */}
        <form action={logoutAction}>
          <Button
            type="submit"
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white hover:bg-gray-800"
          >
            <LogOut className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Salir</span>
          </Button>
        </form>
      </div>
    </header>
  );
}
