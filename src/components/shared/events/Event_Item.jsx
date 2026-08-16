import React from "react";
import { currentLanguageCode } from "../../../utils/switchLang";
import { CalendarIcon, HomeIcon } from "../../../assets/icons/Icon";
import Button from "../Button";
import { useTranslation } from "react-i18next";
import { apiKey } from "../../../service/apiUrl";
import Counter from "../counter/Counter";
import { SarIcon } from "../../../assets/images/Image";

import { getImageUrl, IMG } from "../../../utils/getImageUrl";

const Event_Item = ({
  item,
  hasBookingBtn = false,
  insideButton,
  hasCounter = false,
  currentQuantity,
  handleChangeTicket,
  loading,
}) => {
  const { t } = useTranslation();

  return (
    <figure
      key={item?.id}
      className={`relative main_gradient event rounded-lg ${
        hasBookingBtn
          ? "h-[300px] sm:h-[300px] lg:h-[426px]"
          : "h-[250px] sm:h-[300px] lg:h-[426px]"
      }`}
    >
      <img
        src={getImageUrl(item?.image, { width: IMG.card })}
        alt={currentLanguageCode === "en" ? item?.title : item?.title_ar}
        loading="lazy"
        decoding="async"
        className="w-full h-full object-cover rounded-lg"
      />
      <div
        dir={currentLanguageCode === "en" ? "ltr" : "rtl"}
        className="absolute z-10 bottom-3 md:bottom-[40px]  w-[calc(100%_-_24px)] md:w-[calc(100%_-_80px)] left-[50%] translate-x-[-50%] flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 "
      >
        <figcaption className=" start-3 md:start-[40px] max-w-full xs:max-w-[342px] flex flex-col gap-1 sm:gap-3 ">
          <header className="flex items-center gap-5">
            <div className="flex items-center gap-1 text-font-light ">
              <CalendarIcon />
              <span className="text-sm text-nowrap ">
                {item?.available_dates?.date}
              </span>
            </div>
            <div className="flex items-center gap-1 text-font-light truncate ">
              <HomeIcon />
              <span className="text-sm truncate">
                {currentLanguageCode === "en"
                  ? item?.hut?.title ?? "-"
                  : item?.hut?.title_ar ?? "-"}
              </span>
            </div>
          </header>
          <h3 className="truncate headline_lg text-font-light">
            {currentLanguageCode === "en" ? item?.title : item?.title_ar}
          </h3>
          <p className="line-clamp-2 sm:line-clamp-3 text-xs sm:text-sm md:text-base text-font-light">
            {currentLanguageCode === "en"
              ? item?.description
              : item?.description_ar}
          </p>
          {hasCounter && (
            <div className="flex_center_y justify-between">
              {item?.available_dates?.price && (
                <div className="flex items-center gap-1 text-white text-base font-semibold">
                  <img loading="lazy" decoding="async"
                    src={SarIcon}
                    alt="sar"
                    className="w-5 h-5 object-center"
                  />
                  <span>
                    {item?.available_dates?.price} {t("per_night")}
                  </span>
                </div>
              )}
              {hasCounter && (
                <Counter
                  textClassName="!text-white"
                  disabled={loading}
                  max={item?.max_purchasable_quantity}
                  min={item?.min_purchasable_quantity}
                  value={currentQuantity}
                  handleChange={(e) =>
                    handleChangeTicket(
                      e,
                      item?.id,
                      item?.available_dates?.price,
                      item?.available_dates?.id
                    )
                  }
                />
              )}
            </div>
          )}
          {insideButton && insideButton()}
        </figcaption>
        {hasBookingBtn && (
          <Button
            className=" truncate  end-3 md:end-[40px]  max-w-full sm:max-w-[230px] md:max-w-[274px]"
            type="glass"
            to={`/event/${item?.id}/details`}
          >
            {t("book_now")}
          </Button>
        )}
      </div>
    </figure>
  );
};

export default Event_Item;
