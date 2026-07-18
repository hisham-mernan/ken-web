import React, { useState } from "react";

import Service_Item from "./Service_Item";
import Landing_Header from "../../layout/header/Landing_Header";
import { Skeleton } from "primereact/skeleton";
import useGetData from "../../../hooks/useGetData";
import { API } from "../../../service/apiUrl";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { useTranslation } from "react-i18next";
const Services = () => {
  const { i18n } = useTranslation();
  const currentLanguageCode = i18n?.translator?.language;
  const isEn = currentLanguageCode === "en";

  const [swiper, setSwiper] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(1);
  const isPrevDisabled = swiper ? swiper.isBeginning : true;
  const isNextDisabled = swiper ? swiper.isEnd : true;
  const { data, loading } = useGetData(API.home.services);

  if (data?.length === 0) {
    return;
  }

  return (
    <section className="Container section_gap section_p ">
      <Landing_Header title="services" src="services" />
      <div className={` `}>
        <Swiper
          key={currentLanguageCode}
          onSwiper={setSwiper}
          slidesPerView="auto"
          // spaceBetween={28}
          allowTouchMove={false}
          loop={false}
          speed={500}
          dir={isEn ? "ltr" : "rtl"}
          onSlideChange={(s) => setCurrentSlide(s.realIndex + 1)}
          breakpoints={{
            0: { slidesPerView: 1, allowTouchMove: true, spaceBetween: 4 },
            480: { slidesPerView: 2, allowTouchMove: true, spaceBetween: 4 },
            740: { slidesPerView: 3, allowTouchMove: true, spaceBetween: 4 },
            950: {
              slidesPerView: "auto",
              allowTouchMove: true,
              spaceBetween: 4,
            },
            1200: { slidesPerView: 4, allowTouchMove: false, spaceBetween: 20 },
            // 1280: { slidesPerView: 4, allowTouchMove: false, spaceBetween: 28 },
          }}
          className={`service_swiper `}
        >
          {loading
            ? Array.from({ length: 4 })?.map((_, idx) => (
                <SwiperSlide className={` group service_card `}>
                  <ServiceSkeleton key={idx} />
                </SwiperSlide>
              ))
            : data?.slice(0, 4).map((item) => (
                <SwiperSlide key={item.id} className={` group service_card `}>
                  <Service_Item data={item} />
                </SwiperSlide>
              ))}
        </Swiper>
      </div>
    </section>
  );
};
const ServiceSkeleton = () => {
  return (
    <div className=" bg-gray-50 z-10 h-[490px] xs:h-[420px] sm:h-[506px] rounded-lg relative overflow-hidden">
      {/* Content overlay */}
      <div className="absolute bottom-[25px] w-[90%] left-1/2 -translate-x-1/2 z-10 flex flex-col gap-2">
        {/* Title */}
        <Skeleton
          width="70%"
          height="1.5rem"
          className="rounded-md !bg-gray-200"
        />
        {/* Description (3 lines) */}
        <Skeleton width="100%" height="1rem" className="rounded !bg-gray-200" />
        <Skeleton width="90%" height="1rem" className="rounded !bg-gray-200" />
        <Skeleton width="80%" height="1rem" className="rounded !bg-gray-200" />
      </div>
    </div>
  );
};
export default Services;
