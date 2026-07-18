import React from "react";

// lib
import Slider from "react-slick";
import { useTranslation } from "react-i18next";

// utils
import { currentLanguageCode } from "../../../../utils/switchLang";

// hook
import useGetData from "../../../../hooks/useGetData";

// service
import { API } from "../../../../service/apiUrl";
import Landing_Header from "../../../../components/layout/header/Landing_Header";

const Our_Partener = () => {
  const { t } = useTranslation();
  const { data, loading } = useGetData(API.parteners);
  const settings = {
    dots: false,
    infinite: data?.length > 7,
    speed: 500,
    autoplay: data?.length > 7,
    autoplaySpeed: 3000,
    cssEase: "linear",
    slidesToShow: 7,
    slidesToScroll: 1,
    pauseOnHover: false,
    // rtl: currentLanguageCode === "en" ? false : true,
    responsive: [
      {
        breakpoint: 991,
        settings: {
          slidesToShow: Math.min(4, data.length),
        },
      },
      {
        breakpoint: 500,
        settings: {
          slidesToShow: Math.min(3, data.length),
        },
      },
    ],
  };
  if (data?.length === 0) {
    return;
  }
  return (
    <section
      className={`flex flex-col gap-16 ${
        data?.length < 4 ? "about_slide" : ""
      } `}
    >
      <Landing_Header title="our_partner" />
      <figure>
        <Slider {...settings}>
          {data?.map((item) => (
            <img
              key={item?.id}
              src={item?.image}
              className="h-[31px] !max-w-[150px] object-contain object-center"
              alt="partner logo"
            />
          ))}
        </Slider>
      </figure>
    </section>
  );
};

export default Our_Partener;
