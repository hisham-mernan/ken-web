import React from "react";
import { useTranslation } from "react-i18next";

const Right_Text_Header = ({ title = "", className = "" }) => {
  const { t } = useTranslation();
  return (
    <header className="flex_center_y justify-center sm:justify-start gap-1 ">
      <h2
        className={`  font-semibold text-center sm:text-start text-[35px] lg:text-[44px] xl:text-[45px] text-primary-4 ${className} `}
      >
        {t(title)}
      </h2>
      <div className="flex-1 h-[.5px] bg-primary-4 hidden sm:flex " />
    </header>
  );
};

export default Right_Text_Header;
