import React, { useState } from "react";
import { currentLanguageCode } from "../../../utils/switchLang";
import { useTranslation } from "react-i18next";
import { SarIcon } from "../../../assets/images/Image";
import Counter from "../counter/Counter";
import { apiKey } from "../../../service/apiUrl";

const Service_Item = ({
  data,
  children,
  className = "",
  hasCounter = false,
  loading,
  currentQuantity,
  handleChangeTicket,
}) => {
  const { t } = useTranslation();

  return (
    <figure
      className={`main_gradient dark ${className} z-10 h-[490px] sm:h-[420px] sm:h-[506px] rounded-lg relative`}
    >
      <img
        src={
          data?.image?.includes(apiKey)
            ? data?.image
            : `${apiKey}${data?.image}`
        }
        className="w-full h-full object-fill rounded-lg"
      />
      <figcaption className="absolute bottom-[25px] w-[90%] left-[50%] translate-x-[-50%] z-10">
        <h4 className="text-font-light headline_sm truncate">
          {currentLanguageCode === "en" ? data?.title : data?.title_ar}
        </h4>
        <p className="text-font-light/80 line-clamp-3">
          {currentLanguageCode === "en"
            ? data?.description
            : data?.description_ar}
        </p>
        <div className="flex flex-col gap-3">
          <div>
            {data?.available_dates?.price && (
              <div className="flex items-center gap-1 text-white text-base font-semibold">
                <img
                  src={SarIcon}
                  alt="sar"
                  className="w-5 h-5 object-center"
                />
                <span>
                  {data?.available_dates?.price} {t("per_night")}
                </span>
              </div>
            )}
            {hasCounter && (
              <Counter
                textClassName="!text-white"
                disabled={loading}
                max={data?.max_purchasable_quantity}
                min={data?.min_purchasable_quantity}
                value={currentQuantity}
                handleChange={(e) =>
                  handleChangeTicket(
                    e,
                    data?.id,
                    data?.price,
                    data?.available_dates?.id
                  )
                }
              />
            )}
          </div>
          {children}
        </div>
      </figcaption>
    </figure>
  );
};

export default Service_Item;
