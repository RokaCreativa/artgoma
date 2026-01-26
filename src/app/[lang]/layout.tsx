import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

import { Locale, i18n } from "@/configs/i18n.config";
import DictionaryProvider from "@/providers/DictionaryProvider";
import { getDictionary } from "@/configs/dictionary";
import NextAuthProvider from "@/providers/NextAuthProvider";
import Navbar from "./components/navbar";
import { Toaster } from "@/components/ui/toaster";

const montserrat = Montserrat({ subsets: ["latin"] });

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
  const dictionary = await getDictionary(validLang);

  return (
    <html className="scroll-smooth" lang={validLang}>
      <body className={montserrat.className}>
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
