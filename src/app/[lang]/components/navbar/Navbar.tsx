import FlagsDropdown from "./FlagsDropdown";
import { Locale } from "@/configs/i18n.config";
import { getDictionary } from "@/configs/dictionary";
import UserDropdown from "./auth/UserDropdown";
import ScrollNavigation from "./ScrollNavigation";
import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

const Navbar = async ({ lang }: { lang: Locale }) => {
  const { navbar } = await getDictionary(lang);
  const session = await getServerSession(authOptions);

  return (
    <nav className="flex justify-around w-full fixed z-[200] top-4">
      <Link href={`/${lang}`} className="bg-black/50 backdrop-blur-md px-2 rounded-2xl">
        <Image className="h-12 w-12 md:h-10 md:w-10 " src="/logo-artgoma.svg" alt="logo goma" width={80} height={80} />
      </Link>

      <div className="flex gap-6 items-center">
        <Suspense fallback={<div>Loading...</div>}>
          <FlagsDropdown />
        </Suspense>
        <ScrollNavigation lang={lang} navbar={navbar} />
        {session && <UserDropdown session={session} />}
      </div>
    </nav>
  );
};

export default Navbar;
