import React from "react";
import Branded_Section from "../../../components/shared/Branded_Section";
import { useTranslation } from "react-i18next";
import Landing_Header from "../../../components/layout/header/Landing_Header";
import { Vector } from "../../../assets/images/Image";
import { currentLanguageCode } from "../../../utils/switchLang";
import { Skeleton } from "primereact/skeleton";
import useGetData from "../../../hooks/useGetData";
import { API } from "../../../service/apiUrl";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const About_Section = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n?.language === "ar";
  const { data, loading } = useGetData(API.about_section);

  const list = [
    {
      title: "our_mission",
      description:
        currentLanguageCode === "en"
          ? data?.at(0)?.mission
          : data?.at(0)?.mission_ar,

      image: data?.at(0)?.mission_image,
      alt: "our mission",
    },
    {
      title: "our_vision",
      description:
        currentLanguageCode === "en"
          ? data?.at(0)?.vission
          : data?.at(0)?.vission_ar,
      image: data?.at(0)?.vision_image,
      alt: "Our Vision",
    },
  ];

  if (data?.length === 0) {
    return;
  }

  return (
    <section className="section_p">
      <div className="relative z-10 Container section_gap">
        <Landing_Header title="about_us" src="about" />
        <div>
          <Swiper
            key={isRtl}
            slidesPerView={2}
            spaceBetween={32}
            breakpoints={{
              0: {
                spaceBetween: 9,
                slidesPerView: 1.1,
              },
              600: {
                slidesPerView: 2,
                spaceBetween: 9,
              },
            }}
          >
            {loading ? (
              <About_Section_Skeleton />
            ) : (
              <>
                {list?.map((item, idx) => (
                  <SwiperSlide
                    key={idx}
                    className="    flex flex-col gap-4 md:gap-[18px]"
                  >
                    <figure className="   main_gradient main h-[350px] md:h-[450px] lg:h-[543px]   rounded-3xl group overflow-hidden ">
                      <img
                        src={item?.image}
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <div
                        className={`flex flex-col gap-[10px] sm:gap-3 md:gap-[18px] about_gradiant absolute z-10 inset-0 sm:translate-y-full sm:group-hover:translate-y-0 transition-all ease-in-out duration-500 flex flex-col justify-end px-6 pb-6 `}
                      >
                        <h3 className="text-white display_xs font-bold ">
                          {t(item?.title)}
                        </h3>
                        <p className="text-[#EBEBEB] text-xs md:text-base md:text-lg lg:text-[21px] lg:leading-[25px] line-clamp-3 font-normal ">
                          {item?.description}
                        </p>
                      </div>
                    </figure>
                  </SwiperSlide>
                ))}
              </>
            )}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

const About_Section_Skeleton = () => {
  const skeletonItems = [1, 2];

  return (
    <section className="grid xs:grid-cols-2 gap-6 xs:gap-4 md:gap-8 ">
      {skeletonItems.map((_, idx) => (
        <div key={idx} className="flex flex-col gap-[18px]">
          <div className="h-[350px] md:h-[450px] lg:h-[543px] ">
            <Skeleton className="w-full rounded-2xl!" height="100%" />
          </div>
        </div>
      ))}
    </section>
  );
};

export default About_Section;
