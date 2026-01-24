"use client";

import { Locale } from "@/configs/i18n.config";
import Link from "next/link";
import { usePathname } from "next/navigation";

const ScrollNavigation = ({
  lang,
  navbar,
}: {
  lang: Locale;
  navbar: {
    nav: string[];
  };
}) => {
  const pathName = usePathname();

  if (pathName === `/${lang}`) {
    return (
      <div className="hidden md:flex gap-3">
        <Link href="#enjoy-live">
          <span className="hover:text-red-400 shadow-red-100 hover:text-shadow-lg text-red-600 md:text-xs lg:text-base">
            {navbar.nav[0]}
          </span>
        </Link>
        <Link href="#conect">
          <span className="hover:text-red-400 shadow-red-100 hover:text-shadow-lg text-red-600 md:text-xs lg:text-base">
            {navbar.nav[1]}
          </span>
        </Link>
        <Link href="#stories">
          <span className="hover:text-red-400 shadow-red-100 hover:text-shadow-lg text-red-600 md:text-xs lg:text-base">
            {navbar.nav[2]}
          </span>
        </Link>
        <Link href="#get-inspired">
          <span className="hover:text-red-400 shadow-red-100 hover:text-shadow-lg text-red-600 md:text-xs lg:text-base">
            {navbar.nav[3]}
          </span>
        </Link>
        <Link href="#contact">
          <span className="hover:text-red-400 shadow-red-100 hover:text-shadow-lg text-red-600 md:text-xs lg:text-base">
            {navbar.nav[4]}
          </span>
        </Link>
      </div>
    );
  }
};

export default ScrollNavigation;
