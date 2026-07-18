import React from "react";

// lib
import "swiper/css";
import { Skeleton } from "primereact/skeleton";
import { useTranslation } from "react-i18next";
import { Swiper, SwiperSlide } from "swiper/react";
// components
import Hut_Card from "../../../components/shared/card/Hut_Card";
import Landing_Header from "../../../components/layout/header/Landing_Header";

// hooks
import useGetData from "../../../hooks/useGetData";

// services
import { API } from "../../../service/apiUrl";

const Discover = () => {
  const { data, loading } = useGetData(API.home.huts);
  const { t, i18n } = useTranslation();
  const isRtl = i18n?.language === "ar";
  console.log(data, "da");
  return (
    <section className="Container  w-full section_gap section_p">
      <Landing_Header title="discover" src="discover" />
      <div>
        <Swiper
          key={isRtl}
          slidesPerView={3}
          spaceBetween={80}
          breakpoints={{
            0: { spaceBetween: 9, slidesPerView: 1.1 },
            600: {
              slidesPerView: 2.1,
              spaceBetween: 12,
            },
            991: { spaceBetween: 24, slidesPerView: 2.5 },
            1024: {
              spaceBetween: 80,
              slidesPerView: 3,
            },
          }}
        >
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <SwiperSlide key={i}>
                  <Hut_Card_Skeleton />
                </SwiperSlide>
              ))
            : data?.map((item, index) => (
                <SwiperSlide key={item?.id}>
                  <Hut_Card
                    alt={item?.title}
                    image={item?.main_image}
                    data={item}
                  />
                </SwiperSlide>
              ))}
        </Swiper>
      </div>
    </section>
  );
};

const Hut_Card_Skeleton = ({ className = "" }) => {
  return (
    <div
      className={`card_shadow rounded-xl w-full max-w-[360px] relative ${className}`}
    >
      {/* Image Skeleton */}
      <Skeleton
        height="266px"
        width="100%"
        borderRadius="0.75rem 0.75rem 0 0"
      />

      {/* Card Body */}
      <div className="bg-white py-6 px-9 flex flex-col gap-[18px] text-secondary">
        <div className="flex flex-col gap-[14px]">
          {/* Title */}
          <Skeleton width="60%" height="24px" />

          {/* Description */}
          <Skeleton width="100%" height="16px" />
          <Skeleton width="80%" height="16px" />

          {/* Price */}
          <Skeleton width="40%" height="20px" className="mt-2" />

          {/* List */}
          <ul className="flex items-center justify-between w-full mt-3">
            {[1, 2, 3].map((id) => (
              <li key={id} className="flex_center_y gap-2">
                <Skeleton shape="circle" size="20px" />
                <Skeleton width="48px" height="16px" />
              </li>
            ))}
          </ul>
        </div>

        {/* Button */}
        <Skeleton
          width="100%"
          height="40px"
          borderRadius="9999px"
          className="mt-4"
        />
      </div>
    </div>
  );
};

export default Discover;
