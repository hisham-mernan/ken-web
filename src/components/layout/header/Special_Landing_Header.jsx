import React from "react";
import { useTranslation } from "react-i18next";

const Special_Landing_Header = ({
  title = "",
  italicTitle = "",
  className,
}) => {
  const { t } = useTranslation();
  return (
    <header
      className={`relative max-w-[1536px] mx-auto pt-[130px] md:pt-[172px] flex items-center w-full ${className} `}
    >
      <div className="flex-1 bg-secondary-dark h-[.5px]" />
      <h1 className="display_sm px-1 sm:px-2 text-secondary-dark tracking-normal sm:tracking-[2px] flex items-center gap-2 ">
        {t(title)}
        <span className="capitalize  text-primary-5 font-normal text-[35px] sm:text-[50px] lg:text-[62px]">
          {t(italicTitle)}
        </span>
      </h1>
      <div className="flex-1 bg-secondary-dark h-[.5px]" />
    </header>
  );
};

export default Special_Landing_Header;
