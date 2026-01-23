import { Locale } from "@/configs/i18n.config";
import Circle from "./components/circle";
import Carousel from "./components/sections/carousel";
import Carousel2 from "./components/sections/carousel2/Carousel2";
import Connect from "./components/sections/connect";
import Footer from "./components/sections/footer";
import GetInTouch from "./components/sections/getInTouch";
import GetInspired from "./components/sections/getInspired";
import Hero from "./components/sections/hero";
import Location from "./components/sections/location";
import LogoCarousel from "./components/carousel";
import ArtistsCarousel from "./components/carousel2/ArtistsCarousel";
import GoldenTicketsCarousel from "./components/carousel-tickets";

const Home = ({ params: { lang } }: { params: { lang: Locale } }) => {
  return (
    <main className="overflow-x-hidden">
      <Hero lang={lang} />
      <Carousel />
      <Connect lang={lang} />
      <div className="relative">
        <Circle
          color="border-red-600"
          position="absolute"
          z="z-50"
          className={
            "h-32 w-32 md:h-44 md:w-44 border-[20px] md:border-[32px] border-red-600 -top-32 right-0 translate-x-16 translate-y-12 z-50"
          }
        />
      </div>
      <Carousel2 />
      <LogoCarousel />
      <GoldenTicketsCarousel />
      <GetInspired lang={lang} />
      <ArtistsCarousel />
      <Location lang={lang} />
      <GetInTouch lang={lang} />
      <Footer />
    </main>
  );
};

export default Home;
