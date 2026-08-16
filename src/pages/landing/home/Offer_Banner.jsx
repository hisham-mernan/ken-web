import React, { useRef, useState } from "react";
import useGetData from "../../../hooks/useGetData";
import { API } from "../../../service/apiUrl";
import { useTranslation } from "react-i18next";
// lib
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css/pagination";
import { getImageUrl, IMG } from "../../../utils/getImageUrl";
import {
  HomeOfferBg,
  OfferImg1,
  TicketImg,
} from "../../../assets/images/Image";
const fakeData = [
  {
    id: 1,
    title: "كل ما طـــالــــت إقامتك زاد التوفير",
    title_en: "Stay Longer Save More",
    description: "احصل على خصم 10٪ عند حجز ليلتين أو أكثر.",
    description_en: "Enjoy 10% off when you book 2 nights or more!",
    from: "July 23",
    time: "17:00",
    to: "July 23",
    hut: "The Main Hut",
    image: OfferImg1,
  },
];

const Ticket = ({ item, className }) => {
  const { i18n } = useTranslation();
  const isRtl = i18n?.language === "ar";
  return (
    <div
      className={`absolute z-10 ${className}`}
      style={{ transform: isRtl ? "rotate(30deg)" : "rotate(-30deg)" }}
    >
      {/* Ticket Image */}
      <img loading="lazy" decoding="async"
        src={TicketImg}
        className="w-full h-full object-fill relative z-10"
        alt="ticket"
      />

      {/* Ticket Content */}
      <div className="relative z-20 flex flex-col bottom-full text-end gap-3 p-6 text-[#2E301A]">
        <h1 className="font-bold text-[32px] tracking-wide">Ken Hut</h1>

        <p className=" text-sm sm:text-base text-black flex flex-col">
          <span>{item?.from}</span>
          <span>{item?.time}</span>
          <span>{item?.hut}</span>
        </p>

        <img loading="lazy" decoding="async"
          src={getImageUrl(item?.image, { width: IMG.thumb })}
          className="w-[152px] h-20 rounded-sm object-cover"
          alt=""
        />
      </div>
    </div>
  );
};
const Offer_Banner = () => {
  const { i18n } = useTranslation();
  const isRtl = i18n?.language === "ar";

  const swiperRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  // const { data: d, loading } = useGetData(API.home.offer);
  const data = fakeData;

  return (
    <div className="Container section_p">
      <Swiper
        key={isRtl}
        loop
        dir={isRtl ? "rtl" : "ltr"}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
      >
        {data.map((item) => (
          <SwiperSlide
            key={item?.id}
            style={{
              position: "relative",
              backgroundImage: `url(${HomeOfferBg})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
            }}
            className="! relative   offer_item rounded-lg grid grid-cols-2 px-5 sm:px-[50px]"
          >
            <section className=" h-[190px]! sm:h-[392px]!  relative  max-w-[138px] sm:max-w-[280px] xl:max-w-[459px]   z-10 flex flex-col justify-center gap-[5px] sm:gap-[18px] ">
              <h1
                className={`${
                  isRtl ? "text-base" : "text-xl"
                } sm:text-3xl xl:text-4xl 2xl:text-5xl font-light tracking-[2px] text-white xl:max-w-[265px]`}
              >
                {isRtl ? item?.title : item?.title_en}
              </h1>
              <p className="text-white text-xs sm:text-base xl:text-xl 2xl:text-2xl font-normal ">
                {isRtl ? item?.description : item?.description_en}
              </p>
            </section>
            <figure className="">
              {/* Ticket 1 */}
              <Ticket
                item={item}
                className="w-[190px]  h-[370px] top-[-15%] sm:top-[17%] lg:top-[20%] end-[-12%] sm:end-[4%] scale-[50%] sm:scale-90 md:scale-100"
              />

              {/* Ticket 2 */}
              <Ticket
                item={item}
                className="w-[190px] h-[370px] top-[20%] sm:top-[55%] end-[10%] sm:end-[24%] lg:end-[20%] 2xl:end-[17%] scale-[50%] sm:scale-90 md:scale-100"
              />
            </figure>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Offer_Banner;
