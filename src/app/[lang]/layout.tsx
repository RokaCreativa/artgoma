// 🧭 MIGA DE PAN: Root Layout con Apariencia Dinamica
// 📍 UBICACION: src/app/[lang]/layout.tsx
// 🎯 PORQUE EXISTE: Layout principal que inyecta CSS variables desde BD
// 🔗 USADO EN: Todas las paginas del sitio
// 🚨 CUIDADO: Cambios en appearance configs se reflejan en max 5 minutos (cache)
// 📋 SPEC: SPEC-26-01-2026-CMS-ContentManager (Tarea 5.4)

import type { Metadata } from "next";
import { Cormorant_Garamond, Montserrat } from "next/font/google";
import "./globals.css";

import { Locale, i18n } from "@/configs/i18n.config";
import DictionaryProvider from "@/providers/DictionaryProvider";
import { getDictionary } from "@/configs/dictionary";
import NextAuthProvider from "@/providers/NextAuthProvider";
import Navbar from "./components/navbar";
import { Toaster } from "@/components/ui/toaster";
import {
  getAppearanceConfigs,
  generateAppearanceCSS,
  generateGoogleFontsURL,
} from "@/lib/cms/appearanceUtils";

// Font Display (titulos H1/H2) - elegancia artistica, estilo galeria de arte
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-display",
});

// Font Sans (body/UI) - limpia y legible
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "ArtGoMA",
  description: "Welcome to GoMa gallery! UNIQUE ART EXPERIENCE IN TENERIFE",
  keywords: ["Art Goma", "GoMA", "Arte en Tenerife", "Galería GoMA"],
  authors: [{ name: "Karen" }],
  creator: "Karen",
  openGraph: {
    title: "ArtGoMa",
    description: "Welcome to GoMA gallery! UNIQUE ART EXPERIENCE IN TENERIFE",
    url: "https://artgoma.vercel.app",
    siteName: "ArtGoMA",
    images: [
      {
        url: "https://artgoma.vercel.app/bg-black-logo-goma.png",
        width: 600,
        height: 600,
        alt: "ArtGoMA",
      },
    ],
    type: "website",
    locale: "es",
  },
  icons: {
    icon: ["/favicon.ico"],
    apple: ["/apple-touch-icon.png"],
    shortcut: ["/apple-touch-icon.png"],
  },
};

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = await params;
  const validLang = lang as Locale;

  // Cargar en paralelo: diccionario + appearance configs
  const [dictionary, appearance] = await Promise.all([
    getDictionary(validLang),
    getAppearanceConfigs(),
  ]);

  // Generar CSS dinamico con variables desde BD
  const appearanceCSS = generateAppearanceCSS(appearance);

  // Generar URL de fonts extra si no son las default
  const extraFontsURL = generateGoogleFontsURL(
    appearance.fontDisplay,
    appearance.fontBody
  );

  return (
    <html className="scroll-smooth" lang={validLang}>
      <head>
        {/* Inyectar CSS variables desde BD - cache 5min */}
        <style
          dangerouslySetInnerHTML={{
            __html: appearanceCSS,
          }}
        />
        {/* Cargar fonts extra si se configuraron diferentes en admin */}
        {extraFontsURL && (
          <>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link
              rel="preconnect"
              href="https://fonts.gstatic.com"
              crossOrigin="anonymous"
            />
            <link href={extraFontsURL} rel="stylesheet" />
          </>
        )}
      </head>
      <body className={`${montserrat.variable} ${cormorant.variable} font-sans`}>
        <NextAuthProvider>
          <DictionaryProvider dictionary={dictionary}>
            <div className="hidden md:block fixed z-[190] h-16 w-3/4 right-0 backdrop-blur-sm bg-gradient-to-l from-black via-black to-transparent rounded-l-full overflow-hidden"></div>
            <Navbar lang={validLang} />
            {children}
            <Toaster />
          </DictionaryProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
