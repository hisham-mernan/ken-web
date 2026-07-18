import React from "react";
import { useTranslation } from "react-i18next";
import {
  AboutHero1,
  AboutHero2,
  Decore,
  HeaderAboutAr,
  HeaderFaqAr,
  HeaderFaqEn,
  StarIcon,
} from "../../../assets/images/Image";
import Button from "../../../components/shared/Button";
import { currentLanguageCode } from "../../../utils/switchLang";
import useGetData from "../../../hooks/useGetData";
import { API } from "../../../service/apiUrl";

const About_Hero = () => {
  const { t } = useTranslation();

  return (
    <section className="flex flex-col lg:flex-row gap-10 lg:gap-20  Container w-full">
      {/* start content */}
      <div
        className={`flex flex-col text-center lg:text-start gap-5 lg:gap-10 ${
          currentLanguageCode === "en"
            ? "w-full lg:w-[465px]"
            : "w-full lg:w-[465px]"
        }`}
      >
        <h1
          className={`text-secondary-dark text-[24px] capitalize md:text-[28px] lg:text-[40px] xl:text-[62px] font-bold ${
            currentLanguageCode === "en" ? "" : "max-w-[365px]"
          }`}
        >
          {t("each_new_place")}
          <div className={` text-secondary-dark inline-flex relative`}>
            <span className="relative z-10">{t("story")}</span>
            <img
              src={Decore}
              className="absolute z-[1] bottom-[20px] max-w-[224px] h-[12px] start-[-18px] "
            />
          </div>
        </h1>
        <p
          className={`text-base md:text-lg lg:text-xl xl:text-2xl text-secondary-4 font-normal ${
            currentLanguageCode === "en" ? "" : "max-w-[310px]"
          } `}
          dangerouslySetInnerHTML={{ __html: t("about_hero_des") }}
        />
      </div>
      {/* end content */}
      <figure className="flex-1 relative  ">
        <div className="relative hero_gradient hero ms-auto w-full h-[225px] xs:h-[300px] md:h-[390px] lg:w-[650px] lg:h-[424px] rounded-lg border-[2px] border-[#F9F5EB] ">
          <img
            src={AboutHero1}
            className="flex object-cover  w-full h-full rounded-lg "
            alt="about vector"
          />
        </div>
        <div className="absolute bottom-[46px] start-[5%] md:bottom-[90px] lg:bottom-[18%] xl:start-[8%] z-10  border-[2px] border-[#F9F5EB]  hero_gradient thumbnail w-[150px] xs:w-[200px] md:w-[367px] xl:h-[240px] md:h-[200px] rounded-lg ">
          <img
            src={AboutHero2}
            alt="about vector"
            className="flex w-full h-full object-cover rounded-lg "
          />
        </div>
      </figure>
    </section>
  );
};

export default About_Hero;
