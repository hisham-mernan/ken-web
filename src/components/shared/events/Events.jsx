import React from "react";
// lib
import Slider from "react-slick";

// component
import Landing_Header from "../../layout/header/Landing_Header";

import Event_Item from "./Event_Item";
import { currentLanguageCode } from "../../../utils/switchLang";
import useGetData from "../../../hooks/useGetData";
import { API } from "../../../service/apiUrl";
import { Skeleton } from "primereact/skeleton";

const Events = () => {
  const { data, loading } = useGetData(API.home.event);
  const eventsList = Array.isArray(data) ? data : (data?.results || []);

  let settings = {
    dots: true,
    infinite: false,
    speed: 500,
    autoplay: true,
    rtl: currentLanguageCode === "en" ? false : true,
    cssEase: "linear",
    slidesToShow: 1,
    slidesToScroll: 1,
    pauseOnHover: true,
  };

  if (!eventsList || eventsList.length === 0) {
    return null;
  }
  return (
    <section className="Container flex flex-col gap-10 md:gap-24 w-full section_p_t">
      <Landing_Header title="events" des="services_title_des" />
      {loading ? (
        <EventSkeleton />
      ) : (
        <Slider {...settings}>
          {eventsList.map((item) => (
            <Event_Item item={item} key={item?.id} />
          ))}
        </Slider>
      )}
    </section>
  );
};

const EventSkeleton = () => {
  return (
    <div className=" bg-gray-50 relative rounded-lg h-[250px] sm:h-[300px] lg:h-[426px] overflow-hidden">
      {/* Overlay content */}
      <div className="absolute bottom-3 md:bottom-[40px] w-[calc(100%_-_24px)] md:w-[calc(100%_-_80px)] left-1/2 -translate-x-1/2 px-3 md:px-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 z-10">
        <div className="flex flex-col gap-2 w-full max-w-[342px]">
          {/* Calendar + Location */}
          <div className="flex items-center gap-4">
            <Skeleton width="80px" height=".8rem" className="!bg-gray-200" />
            <Skeleton width="100px" height=".8rem" className="!bg-gray-200" />
          </div>
          {/* Title */}
          <Skeleton width="70%" height="1rem" className="!bg-gray-200" />
          {/* Description */}
          <div className="flex flex-col gap-2">
            <Skeleton width="100%" height=".8rem" className="!bg-gray-200" />
            <Skeleton width="90%" height=".8rem" className="!bg-gray-200" />
            <Skeleton width="80%" height=".8rem" className="!bg-gray-200" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Events;
