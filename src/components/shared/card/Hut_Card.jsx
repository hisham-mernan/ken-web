import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { currentLanguageCode } from "../../../utils/switchLang";
import {
  LinearBox,
  PrizeIcon,
  SarIcon,
  UserTag,
} from "../../../assets/icons/Icon";
import Button from "../Button";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css/pagination";

import { getImageUrl, IMG } from "../../../utils/getImageUrl";

const Hut_Card = ({ className = "", data }) => {
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();
  const lang = i18n?.language;
  const isRtl = lang === "ar";
  const swiperRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const list = [
    {
      id: 1,
      icon: <PrizeIcon />,
      value: data?.rate,
    },
    {
      id: 2,
      icon: <UserTag />,
      value: `${
        data?.max_kids_num || data?.max_persons_num
          ? `${Math.min(data.max_persons_num, data.max_kids_num)} - ${
              data?.max_kids_num + data?.max_persons_num
            } ${t("person")}`
          : "-"
      }`,
    },
    { id: 3, icon: <LinearBox />, value: data?.size },
  ];

  // Construct unique images array combining main_image + sub-gallery images
  const allImages = [];
  if (data?.main_image) {
    allImages.push(data.main_image);
  }
  if (Array.isArray(data?.images)) {
    data.images.forEach((imgObj) => {
      const url = typeof imgObj === "string" ? imgObj : imgObj?.image;
      if (url && !allImages.includes(url)) {
        allImages.push(url);
      }
    });
  }
  const imagesList = allImages.length > 0 ? allImages : [""];

  return (
    <div
      onClick={() => navigate(`/huts/${data?.id}/details`)}
      onMouseEnter={() => swiperRef.current?.autoplay.start()}
      onMouseLeave={() => swiperRef.current?.autoplay.stop()}
      className={`card_shadow transition-all overflow-hidden group ease-in-out duration-500 rounded-xl max-w-[360px] relative cursor-pointer ${className}`}
    >
      <figure className="relative">
        <Swiper
          key={isRtl}
          loop={imagesList.length > 1}
          dir={isRtl ? "rtl" : "ltr"}
          modules={[Autoplay]}
          autoplay={{
            delay: 1500,
            disableOnInteraction: false,
            pauseOnMouseEnter: false,
          }}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
            swiper.autoplay.stop();
          }}
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        >
          {imagesList?.map((item, idx) => (
            <SwiperSlide key={idx}>
              <figure className="hut_image_layout h-[266px] object-cover w-full">
                <img
                  src={getImageUrl(typeof item === "string" ? item : item?.image, {
                    width: IMG.card,
                  })}
                  alt={data?.title}
                  loading="lazy"
                  decoding="async"
                  className="h-[266px] object-cover w-full"
                />
              </figure>
            </SwiperSlide>
          ))}
        </Swiper>
        {/* pagination dots */}
        {imagesList.length > 1 && (
          <div className="hidden group-hover:flex gap-1 absolute bottom-[11px] left-1/2 -translate-x-1/2 z-10">
            {imagesList?.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  swiperRef.current?.slideToLoop(index);
                }}
                className={`border h-2.5 w-2.5 rounded-full transition-all cursor-pointer ${
                  activeIndex === index
                    ? "bg-secondary-3 border-secondary-4"
                    : "bg-[#927D671A] backdrop-blur-xs border-[#927D67]"
                }`}
              />
            ))}
          </div>
        )}
      </figure>

      {/* card content */}
      <div className="bg-white pt-[19px] md:pt-6 pb-[15px] md:pb-[29px] px-7 md:px-[34px] flex flex-col gap-[18px] text-secondary">
        <div className="flex flex-col gap-[11px] md:gap-[14px]">
          <h3 className="text-secondary title_lg !font-semibold uppercase">
            {currentLanguageCode === "en" ? data?.title : data?.title_ar}
          </h3>
          <p className="body_xs line-clamp-2 font-semibold">
            {currentLanguageCode === "en"
              ? data?.description
              : data?.description_ar}
          </p>
          {/* price */}
          {data?.lowest_price && data?.lowest_price > 0 && (
            <div className="text-xs flex items-center gap-1 md:text-base font-semibold">
              <SarIcon width="18" height="18" />{" "}
              <span>
                {" "}
                {data?.lowest_price} {"/ "} {t("per_night")}{" "}
              </span>
            </div>
          )}

          <ul className="flex items-center justify-between w-full">
            {list?.map((item) => (
              <li key={item?.id} className="flex_center_y gap-2">
                {item?.icon}
                <span className="text-sm font-normal">{item?.value}</span>
              </li>
            ))}
          </ul>
        </div>
        <Button
          rounded="full"
          size="md"
          textSize="base"
          type="secondary_lighter"
          className="!text-secondary group-hover:!text-white group-hover:!bg-secondary transition-colors duration-300"
        >
          {t("book_now")}
        </Button>
      </div>
    </div>
  );
};

export default Hut_Card;
