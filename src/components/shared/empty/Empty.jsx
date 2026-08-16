import React from "react";
import { PageNotFoundImg } from "../../../assets/images/Image";
import { useTranslation } from "react-i18next";

const Empty = ({
  img = PageNotFoundImg,
  text = "",
  children,
  containerClassName,
  hasImg = true,
}) => {
  const { t } = useTranslation();
  return (
    <section className={`Container  layout_bg_2 ${containerClassName} `}>
      <div className="flex_center flex-col gap-8">
        {hasImg && (
          <img loading="lazy" decoding="async"
            src={img}
            alt="avatar"
            className="max-w-[300px] md:max-w-[400px] mx-auto"
          />
        )}
        {text && (
          <p className="text-grey-500 max-w-[600px] text-center text-sm md:text-base ">
            {t(text)}
          </p>
        )}
        {children}
      </div>
    </section>
  );
};

export default Empty;
