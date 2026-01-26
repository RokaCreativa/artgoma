// 🧭 MIGA DE PAN: Admin Dashboard - Página principal del panel admin
// 📍 UBICACIÓN: src/app/[lang]/admin/page.tsx
// 🎯 PORQUÉ EXISTE: Vista general con resumen de contenido del CMS
// 🔄 FLUJO: Load stats → Display cards
// 📋 SPEC: SPEC-26-01-2026-CMS-ContentManager

import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/cms/auth";
import { Images, FileText, Settings, ArrowRight } from "lucide-react";
import Link from "next/link";
import prisma from "@/lib/db";
import { Locale } from "@/configs/i18n.config";

interface DashboardPageProps {
  params: Promise<{ lang: Locale }>;
}

async function getStats() {
  try {
    const [slidersCount, itemsCount] = await Promise.all([
      prisma.slider.count(),
      prisma.sliderItem.count(),
    ]);

    return { slidersCount, itemsCount };
  } catch {
    // Si las tablas no existen aún, retornar 0
    return { slidersCount: 0, itemsCount: 0 };
  }
}

export default async function AdminDashboardPage({ params }: DashboardPageProps) {
  const { lang } = await params;

  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    redirect(`/${lang}/admin/login`);
  }

  const stats = await getStats();

  const cards = [
    {
      title: "Sliders",
      description: "Gestiona carruseles de videos, imágenes y artistas",
      icon: Images,
      href: `/${lang}/admin/sliders`,
      stats: `${stats.slidersCount} sliders · ${stats.itemsCount} items`,
      color: "bg-red-500",
    },
    {
      title: "Contenido",
      description: "Edita textos de las secciones en todos los idiomas",
      icon: FileText,
      href: `/${lang}/admin/content`,
      stats: "6 secciones · 6 idiomas",
      color: "bg-blue-500",
    },
    {
      title: "Configuración",
      description: "Contacto, redes sociales y datos del footer",
      icon: Settings,
      href: `/${lang}/admin/settings`,
      stats: "Contacto · Redes · Footer",
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome section */}
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">
          Bienvenido al CMS
        </h1>
        <p className="text-gray-400">
          Gestiona el contenido de ArtGoMA desde aquí
        </p>
      </div>

      {/* Quick access cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="group bg-[#1c1f24] border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-all hover:shadow-lg hover:shadow-black/20"
          >
            {/* Icon */}
            <div className={`w-12 h-12 ${card.color} rounded-xl flex items-center justify-center mb-4`}>
              <card.icon className="w-6 h-6 text-white" />
            </div>

            {/* Content */}
            <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-red-500 transition-colors">
              {card.title}
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              {card.description}
            </p>

            {/* Stats */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">{card.stats}</span>
              <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-red-500 group-hover:translate-x-1 transition-all" />
            </div>
          </Link>
        ))}
      </div>

      {/* Quick tips */}
      <div className="bg-[#1c1f24] border border-gray-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">💡 Tips rápidos</h2>
        <ul className="space-y-3 text-gray-400 text-sm">
          <li className="flex items-start gap-2">
            <span className="text-red-500">•</span>
            <span>Para videos, usa URLs de YouTube - se procesan automáticamente</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-500">•</span>
            <span>Arrastra y suelta para reordenar items en los sliders</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-500">•</span>
            <span>Los cambios se reflejan en la web en menos de 1 minuto</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
