import React from "react";
import { HomeHeroTextAr, HomeHeroTextEn } from "../../../assets/images/Image";
import { useTranslation } from "react-i18next";

const Home_Hero = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n?.language === "ar";
  return (
    <section className="h-[450px] sm:h-[650px] xl:h-[743px] rounded-lg bg-black/20 relative home_hero  max-w-[1536px]  flex items-center justify-center mt-3  w-[calc(100%-24px)] m-auto">
      <img src={isRtl ? HomeHeroTextAr : HomeHeroTextEn} />
    </section>
  );
};

export default Home_Hero;
