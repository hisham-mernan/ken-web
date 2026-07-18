import React from "react";
import { useTranslation } from "react-i18next";
import { LongArrowIcon } from "../../../assets/icons/Icon";
import {
  HeaderAboutAr,
  HeaderAboutEn,
  HeaderDiscoverAr,
  HeaderDiscoverEn,
  HeaderEventsAr,
  HeaderEventsEn,
  HeaderFaqAr,
  HeaderFaqEn,
  HeaderServiceAr,
  HeaderServiceEn,
  HeaderTestimonialsAr,
  HeaderTestimonialsEn,
} from "../../../assets/images/Image";

const getPattern = (src, isRtl) => {
  switch (src) {
    case "about":
      return {
        ar: HeaderAboutAr,
        en: HeaderAboutEn,
        className: `${
          isRtl
            ? "w-[240px] md:w-[300px] xl:w-[350px] right-0"
            : " w-[250px] md:w-[300px] xl:w-[385px] left-[-27px]"
        }`,
      };
    case "discover":
      return {
        ar: HeaderDiscoverAr,
        en: HeaderDiscoverEn,
        className: `${
          isRtl
            ? "right-[-20px] w-[340px] xl:w-[580px]"
            : "left-[-25px] w-[220px] md:w-[280px] xl:w-fit"
        }`,
      };
    case "services":
      return {
        ar: HeaderServiceAr,
        en: HeaderServiceEn,
        className: `${
          isRtl
            ? "w-[210px] xl:w-fit right-[-20px]"
            : "left-[-20px] sm:left-[-45px] w-[220px] md:w-[280px] xl:w-fit"
        }`,
      };
    case "events":
      return {
        ar: HeaderEventsAr,
        en: HeaderEventsEn,
        className: `${
          isRtl
            ? "w-[210px] xl:w-fit right-[-20px]"
            : "left-[-20px] sm:left-[-35px] w-[220px] md:w-[280px] xl:w-fit"
        }`,
      };
    case "sm":
      return {
        ar: HeaderAboutAr,
        en: HeaderAboutEn,
        className: `${
          isRtl
            ? "w-[240px] md:w-[310px] lg:w-[320px] right-[-20px] bottom-[11px]!"
            : " w-[220px]  md:w-[300px] left-[-20px] bottom-[11px] md:bottom-[15px]! md:left-[-28px]"
        }`,
      };
    case "md":
      return {
        ar: HeaderAboutAr,
        en: HeaderAboutEn,
        className: `${
          isRtl
            ? "w-[280px] md:w-[250px] lg:w-[320px] right-[-20px] bottom-[5px]!"
            : " w-[210px] md:w-[250px] lg:w-[355px] left-[-8px] md:left-[-10px] lg:left-[-15px]"
        }`,
      };
    case "xl":
      return {
        ar: HeaderTestimonialsAr,
        en: HeaderTestimonialsEn,
        className: `${
          isRtl
            ? "w-[300px] md:w-[380px] xl:w-[480px] right-[-22px] bottom-[6px] md:bottom-[15px]!"
            : "w-[350px] md:w-[450px] xl:w-[554px] left-[-25px] bottom-[9px] md:bottom-[12px] xl:bottom-[15px]"
        }`,
      };
    case "2xl":
      return {
        ar: HeaderTestimonialsAr,
        en: HeaderTestimonialsEn,
        className: `${
          isRtl
            ? "w-[360px] md:w-[420px] xl:w-[580px] right-[-22px]"
            : "w-[400px] md:w-[550px] xl:w-[704px] left-[-25px]"
        }`,
      };
    case "faq":
      return {
        ar: HeaderFaqAr,
        en: HeaderFaqEn,
        className: `${
          isRtl
            ? "right-[-20px] w-[370px] md:w-[500px] xl:w-[650px]"
            : "left-[-20px] w-[150px] xl:w-fit"
        }`,
      };
    default:
      return {
        ar: HeaderAboutAr,
        en: HeaderAboutEn,
        className: ``,
      };
  }
};

const Landing_Header = ({
  title = "",
  src = "about",
  textClassName,
  containerClassName,
  isCentered = true,
}) => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n?.language === "ar";
  const { ar, en, className } = getPattern(src, isRtl);
  return (
    <header
      className={`relative ${containerClassName ?? ""} ${
        isCentered ? "flex items-center justify-center   w-fit mx-auto" : ""
      }`}
    >
      <h2
        className={`capitalize ${
          textClassName ?? "text-[35px] md:text-[45px] xl:text-[64px]"
        } text-primary-4 relative z-[2] font-bold`}
      >
        {t(title)}
      </h2>
      <img
        src={isRtl ? ar : en}
        alt="shape"
        className={`img ${className} absolute z-[1]  ${
          isRtl
            ? "bottom-[5px] md:bottom-[8px] lg:bottom-[12px]"
            : "bottom-[7px] lg:bottom-[17px]"
        }  `}
      />
    </header>
  );
};

export default Landing_Header;
