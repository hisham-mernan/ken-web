import React, { useState } from "react";

// lib
import { Skeleton } from "primereact/skeleton";
import { useTranslation } from "react-i18next";

// components
import Custome_Calendar from "../../../../../components/shared/calendar/Custome_Calendar";
import Hut_Gallery from "./Hut_Gallery";

// assets
import { SarBlackIcon } from "../../../../../assets/images/Image";
import {
  BathRoom,
  BedRoom,
  CalendarWithSearch,
  SarIcon,
  UserTag,
} from "../../../../../assets/icons/Icon";
// utils
import { currentLanguageCode } from "../../../../../utils/switchLang";

const Content = ({ loading = false, data }) => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const onClose = () => {
    setVisible(false);
  };
  // formater
  const iconList = [
    {
      icon: <UserTag fill="var(--color-primary-3)" width="44" height="44" />,
      // How many the hut sleeps. This used to print a range built from the
      // adult and child allowances added together, so the largest hut
      // advertised "4 - 12 Persons" for somewhere that sleeps eight.
      value: (data?.max_persons_num ?? 0) + (data?.max_kids_num ?? 0)
        ? `${(data?.max_persons_num ?? 0) + (data?.max_kids_num ?? 0)} ${t(
            "person"
          )}`
        : "-",
    },
    {
      icon: <BedRoom fill="var(--color-primary-3)" width="44" height="44" />,
      value: data?.bedrooms_num
        ? `${data?.bedrooms_num} ${t("bedrooms")}`
        : "-",
    },
    {
      icon: <BathRoom fill="var(--color-primary-3)" width="44" height="44" />,
      value: data?.bathrooms_num
        ? `${data?.bathrooms_num} ${t("bathrooms")}`
        : "-",
    },
  ];
  if (loading) {
    return <ContentSkeleton />;
  }

  return (
    <>
      <section className=" grid grid-cols-1 md:grid-cols-2 gap-6 2xl:gap-[46px] ">
        {/* left content */}
        <div className=" w-full md:max-w-[502px] flex flex-col gap-10 xl:gap-[60px] ">
          {/* Price: the hut's two nightly rates. This block used to render
              three rows that all printed the same lowest_price, one of them
              against a hardcoded 1200 strikethrough. */}
          <div className="flex flex-col gap-6">
            {data?.weekday_price > 0 && (
              <header className="flex_center_y">
                <SarIcon width="30" height="30" fill="black" />
                <strong className="headline_lg !font-bold text-secondary ">
                  {Number(data.weekday_price)}
                  <small className="title_lg !font-normal">
                    /{t("weekday_night")}
                  </small>
                </strong>
              </header>
            )}
            {data?.weekend_price > 0 && (
              <div className="flex_center_y">
                <SarIcon width="30" height="30" fill="black" />
                <strong className="headline_lg !font-bold text-secondary ">
                  {Number(data.weekend_price)}
                  <small className="title_lg !font-normal">
                    /{t("weekend_night")}
                  </small>
                </strong>
              </div>
            )}
            {data?.weekday_price > 0 && data?.weekend_price > 0 && (
              <p className="body_lg text-primary-3">{t("long_stay_note")}</p>
            )}
          </div>

          {/* details */}
          <div className="flex justify-between xs:justify-start gap-8 md:gap-11">
            {iconList?.map((item, idx) => (
              <div key={idx} className="flex flex-col gap-3.5">
                {item?.icon}
                <span className="title_lg text-primary-3">{item?.value}</span>
              </div>
            ))}
          </div>
          <div
            className="text-primary-3 text-base leading-[22px] flex flex-col gap-4"
            dangerouslySetInnerHTML={{
              __html:
                currentLanguageCode === "en"
                  ? data?.description?.replace(/\n/g, "<br>")
                  : data?.description_ar?.replace(/\n/g, "<br>"),
            }}
          ></div>
        </div>

        {/* right content */}
        <Hut_Gallery
          images={data?.images}
          title={currentLanguageCode === "en" ? data?.title : data?.title_ar}
        />
      </section>
    </>
  );
};
const ContentSkeleton = () => {
  return (
    <section className="Container flex flex-col md:flex-row gap-4 md:gap-8 xl:gap-12">
      {/* left content */}
      <div className="w-full md:w-1/2 xl:w-3/8 flex flex-col gap-10">
        {/* Price */}
        <div className="flex items-center gap-2">
          <Skeleton shape="circle" width="30px" height="30px" />
          <Skeleton width="120px" height="2rem" />
        </div>

        {/* Icons */}
        <div className="flex justify-between xs:justify-start gap-8 md:gap-11">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex flex-col gap-3.5 items-center">
              <Skeleton shape="circle" width="44px" height="44px" />
              <Skeleton width="80px" height="1rem" />
            </div>
          ))}
        </div>

        {/* description */}
        <div className="flex flex-col gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} width="100%" height="1rem" />
          ))}
        </div>
      </div>

      {/* right content */}
      <div className="w-full md:w-1/2 xl:w-4/8">
        <div className="flex flex-col gap-6 ">
          {/*  image */}
          <Skeleton width="100%" height="330px" className="rounded-lg" />

          {/* bottom images */}
          <div className="flex gap-4 xl:gap-8 mt-3 xl:mt-6">
            {Array.from({ length: 2 }).map((_, i) => (
              <Skeleton
                key={i}
                width="50%"
                height="330px"
                className="rounded-lg"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Content;
