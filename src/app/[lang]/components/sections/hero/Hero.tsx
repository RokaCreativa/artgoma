import Image from "next/image";
import HeroCarousel from "./HeroCarousel";
import H1hero from "./H1hero";
import Circle from "../../circle";
import { Locale } from "@/configs/i18n.config";
import { getDictionary } from "@/configs/dictionary";
import DialogConfirm from "../../dialog-confirm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import Link from "next/link";
import { getConfigByKey } from "@/actions/cms/config";

const Hero = async ({ lang }: { lang: Locale }) => {
  const [dictionary, session, rotateAxisConfig] = await Promise.all([
    getDictionary(lang),
    getServerSession(authOptions),
    getConfigByKey("rotate_axis_icon"),
  ]);
  const { home } = dictionary;
  const rotateAxisSrc = rotateAxisConfig?.data?.value || "/rotate-axis.svg";

  return (
    <div id="home" className="relative h-screen">
      <a
        target="_blank"
        rel="noopener noreferrer"
        href={"https://www.koala360.com/tour?id=10226"}
        id="box"
        className="fixed bottom-8 right-8 md:bottom-16 md:right-16 z-[120] cursor-pointer"
      >
        <div className="relative h-12 w-12 md:h-16 md:w-16 overflow-hidden rounded-2xl p-[1px] backdrop-blur-3xl">
          <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#ffa1a5_0%,#7b1414_50%,#ecadb3_100%)]" />

          <Image
            className="inline-flex h-full w-full items-center justify-center rounded-2xl bg-gray-950 p-2 text-sm font-medium text-gray-50 backdrop-blur-3xl"
            src={rotateAxisSrc}
            height={100}
            width={100}
            alt="rotate-axis"
          />
        </div>
      </a>

      <Circle
        color="border-red-600"
        position="fixed"
        z="z-[100]"
        className={
          "h-28 w-28 md:h-44 md:w-44 border-[25px] md:border-[32px] border-red-600 -translate-x-12 -translate-y-12 md:-translate-x-20 md:-translate-y-20"
        }
      />

      <HeroCarousel />

      <div className="absolute z-50 h-screen w-full flex flex-col gap-4 items-center justify-end pb-24">
        <H1hero text={home.h1} />
        {session ? (
          <Link
            href={`/${lang}/confirm`}
            className="shadow-xl hover:shadow-red-950 transition-shadow duration-300 relative inline-flex h-12 overflow-hidden rounded-full p-[1.5px] focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-gray-50"
          >
            <span className="absolute inset-[-1000%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#ffc6c6_0%,#ff0505_50%,#ff9999_100%)]" />
            <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-gray-950 px-8 py-1 text-sm font-medium text-gray-50 backdrop-blur-3xl">
              {home.button}
            </span>
          </Link>
        ) : (
          <DialogConfirm lang={lang} />
        )}
      </div>
    </div>
  );
};

export default Hero;
