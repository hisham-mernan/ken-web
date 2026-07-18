import React from "react";
import {
  HutsHero1,
  HutsHero2,
  HutsHero3,
  LogoLetterSecondary,
  LogoSecondary,
  VectorSecondary,
} from "../../../../../assets/images/Image";
import { currentLanguageCode } from "../../../../../utils/switchLang";
import Button from "../../../../../components/shared/Button";
import { ArrowIconLight } from "../../../../../assets/icons/Icon";
import { useTranslation } from "react-i18next";

const Huts_Hero = ({ scrollToRef }) => {
  const { t } = useTranslation();
  const handleScroll = () => {
    scrollToRef?.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };
  return (
    <section className=" Container">
      <div className="rounded-t-full h-[250px] xs:h-[350px] md:h-[500px] lg:h-[600px] flex items-center gap-2 md:gap-5">
        <figure
          className={`light_gradient relative w-full h-full ${
            currentLanguageCode === "en" ? "left" : "right"
          }`}
        >
          <img
            src={HutsHero3}
            alt="huts hero"
            className={`object-cover object-center w-full h-full ${
              currentLanguageCode === "en"
                ? "rounded-tl-full"
                : "rounded-tr-full"
            }`}
          />
          <img
            src={VectorSecondary}
            alt="vector"
            className="absolute bottom-[-10px] z-10 start-[-5px] sm:start-[-10px] w-[20px] sm:w-[45px]"
          />
        </figure>
        {/* middle */}
        <figure className="light_gradient relative w-full h-full">
          <img
            src={LogoSecondary}
            className="absolute z-10 left-[50%] translate-x-[-50%] top-[18%] max-w-[70px] xs:max-w-[100px] sm:max-w-[150px] md:max-w-[180px] lg:max-w-[268px] "
          />
          <img
            src={HutsHero2}
            alt="huts hero"
            className=" object-cover object-center w-full h-full"
          />
          <Button
            onClick={handleScroll}
            type="glass"
            className=" cursor-pointer !w-fit !border-font-light !h-[35px] sm:!h-[44px] !p-2 sm:!p-[20px] z-10 absolute bottom-0 sm:bottom-[2%] left-[50%] translate-[-50%] hidden xs:flex items-center  gap-.5 sm:gap-2.5 "
          >
            <span className=" text-nowrap text-font-light text-base lg:text-xl font-normal">
              {t("view_huts")}
            </span>

            <ArrowIconLight fill="var(--color-font-light)" />
          </Button>
        </figure>
        <figure
          className={`light_gradient relative w-full h-full ${
            currentLanguageCode === "en" ? "right" : "left"
          } `}
        >
          <img
            src={HutsHero1}
            alt="huts hero"
            className={` object-cover object-center w-full h-full ${
              currentLanguageCode === "en"
                ? "rounded-tr-full"
                : "rounded-tl-full"
            }`}
          />
          <img
            src={LogoLetterSecondary}
            alt="vector"
            className="absolute bottom-[-10px] z-10 end-[-10px] w-[40px] sm:w-[80px] "
          />
        </figure>
      </div>
    </section>
  );
};

export default Huts_Hero;
