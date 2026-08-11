import React from "react";
import { currentLanguageCode } from "../../../../../utils/switchLang";
import { getImageUrl } from "../../../../../utils/getImageUrl";
import {
  LinearBox,
  PrizeIcon,
  UserTag,
} from "../../../../../assets/icons/Icon";
import { useTranslation } from "react-i18next";
import { SarBlackIcon } from "../../../../../assets/images/Image";
import Button from "../../../../../components/shared/Button";
import Right_Text_Header from "../../../../../components/layout/header/Right_Text_Header";
import Landing_Header from "../../../../../components/layout/header/Landing_Header";

const Hut_Item = ({ data }) => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n?.language == "ar";
  const list = [
    {
      id: 1,
      icon: <PrizeIcon fill="var(--color-primary-3)" width="24" height="24" />,
      value: data?.rate,
    },
    {
      id: 2,
      icon: <UserTag fill="var(--color-primary-3)" width="24" height="24" />,
      value: `${
        data?.max_kids_num || data?.max_persons_num
          ? `${Math.min(data.max_persons_num, data.max_kids_num)} - ${
              data?.max_kids_num + data?.max_persons_num
            } ${t("person")}`
          : "-"
      }`,
    },
    {
      id: 3,
      icon: <LinearBox fill="var(--color-primary-3)" width="24" height="24" />,
      value: t(data?.size),
    },
  ];
  return (
    <section className=" md:border-b border-primary-4">
      <Right_Text_Header
        className="leading-0"
        title={currentLanguageCode === "en" ? data?.title : data?.title_ar}
      />
      <div className="flex flex-col md:flex-row h-full ">
        <figure
          className={`w-full md:w-3/8 pt-14 pb-10 border-b md:border-b-0 ${
            currentLanguageCode === "en" ? "md:border-r" : "md:border-l"
          } border-primary-4 flex flex-col gap-8 lg:gap-12`}
        >
          <figure className="max-w-[95%] xl:max-w-[453px] h-[250px] sm:h-[300px] md:h-[280px] lg:h-[320px] xl:h-[400px] relative rounded-lg overflow-hidden">
            <img
              src={getImageUrl(data?.main_image)}
              className="w-full h-full object-cover object-center rounded-lg "
            />
          </figure>
          <h3
            className={`text-4xl md:text-3xl xl:text-[48px] max-w-[465px] text-secondary-dark font-bold tracking-[1px] md:tracking-[2px]`}
          >
            {t("award")}
            <Landing_Header
              title="wining"
              isCentered={false}
              containerClassName="inline-flex"
              src="md"
              textClassName={`text-[45px] md:text-[40px] ${
                isRtl ? "lg:text-[50px]" : "lg:text-[64px]"
              }`}
            />

            <br />
            {t("style_and_comfort")}
          </h3>
        </figure>

        <div className="pt-8 md:pt-14 pb-10 md:ps-6 flex-1 flex flex-col gap-5 md:gap-8 xl:gap-11 ">
          <figure className="flex gap-3 sm:gap-5 md:gap-8 lg:gap-5 xl:gap-8">
            {data?.images?.length > 0
              ? data?.images?.slice(0, 2)?.map((item) => (
                  <figure key={item?.id || item?.image || item} className="w-full h-[160px] sm:h-[200px] lg:h-[250px] xl:h-[330px] relative rounded-lg overflow-hidden">
                    <img
                      src={getImageUrl(typeof item === "string" ? item : item?.image)}
                      alt="hut images"
                      className="w-full h-full rounded-lg object-cover"
                    />
                  </figure>
                ))
              : [1, 2]?.map((_, i) => (
                  <figure
                    className="w-full h-[160px] sm:h-[200px] lg:h-[250px] xl:h-[330px] bg-gray-50 "
                    key={i}
                  ></figure>
                ))}
          </figure>
          {/* content */}
          <div className="flex flex-col gap-8">
            <h4 className="text-primary-3 font-semibold lg:text-2xl truncate">
              {currentLanguageCode === "en" ? data?.title : data?.title_ar}
            </h4>
            <div className="flex flex-col gap-6">
              <ul className="flex items-center flex-wrap gap-4 md:gap-8 xl:gap-[139px] w-full">
                {list?.map((listItem) => (
                  <li
                    key={listItem?.id}
                    className="flex_center_y gap-2 text-primary-3"
                  >
                    {listItem?.icon}
                    <span className="text-base lg:text-lg xl:text-xl font-normal">
                      {listItem?.value}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="text-primary-3 font-[300] text-xs line-clamp-4">
                {currentLanguageCode === "en"
                  ? data?.description
                  : data?.description_ar}
              </p>
              <div className="flex items-center gap-1 text-primary-3 text-base font-semibold">
                <img
                  src={SarBlackIcon}
                  alt="sar"
                  className="w-5 h-5 object-center"
                />
                <span>
                  {" "}
                  {data?.lowest_price ?? 0} {t("per_night")}{" "}
                </span>
              </div>
              <Button
                to={`/huts/${data?.id}/details`}
                rounded="lg"
                type="primary_dark"
              >
                {t("book_now")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hut_Item;
