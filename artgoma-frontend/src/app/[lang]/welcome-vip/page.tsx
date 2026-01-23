import Link from "next/link";
import H1Text from "./components/H1Text";
import H2Text from "./components/H2Text";
import VipDescription from "./components/VipDescription";
import { X } from "lucide-react";
import { Locale } from "@/configs/i18n.config";
import { getDictionary } from "@/configs/dictionary";
import MoreAboutLink from "./components/MoreAboutLink";
import BlackBox from "./components/BlackBox";
import DialogConfirm from "../components/dialog-confirm";

const WelcomePage = async ({ params: { lang } }: { params: { lang: Locale } }) => {
  const { welcomePage } = await getDictionary(lang);

  return (
    <div
      className="flex flex-col justify-center items-center h-full gap-3 lg:gap-6 relative z-20 bg-paternSm md:bg-paternMd"
      style={{ backgroundImage: "url(/paterngoma.png)" }}
    >
      <div className="flex gap-4 absolute right-6 bottom-6">
        <Link href={`/${lang}`}>
          <X
            stroke="white"
            height={40}
            width={40}
            className="border rounded-full p-1 h-8 w-8 md:h-10 md:w-10 backdrop-blur-sm"
          />
        </Link>
      </div>

      <BlackBox />
      <div className="relative z-50 flex flex-col justify-center items-center">
        <H1Text text1={welcomePage.h1} text2={welcomePage.h2} />
        <H2Text text={welcomePage.h3} />

        <div className="mt-4 md:m-5">
          <DialogConfirm lang={lang} />
        </div>

        <VipDescription text={welcomePage.description} />

        <MoreAboutLink text={welcomePage.buttons.more} lang={lang} />
      </div>
    </div>
  );
};

export default WelcomePage;
