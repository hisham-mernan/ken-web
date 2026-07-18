import React from "react";

// lib
import Slider from "react-slick";
import { Skeleton } from "primereact/skeleton";
// component
import Landing_Header from "../../layout/header/Landing_Header";
import { QuoteImg } from "../../../assets/images/Image";
import { currentLanguageCode } from "../../../utils/switchLang";
import useGetData from "./../../../hooks/useGetData";
import { API } from "../../../service/apiUrl";

const Testimonials = ({ className }) => {
  const { data, loading } = useGetData(API.testimonials);
  let settings = {
    dots: true,
    infinite: data?.length > 3 ? true : false,
    speed: 500,
    autoplay: false,
    autoplaySpeed: 5000,
    cssEase: "linear",
    slidesToShow: 3,
    slidesToScroll: 1,
    pauseOnHover: true,
    rtl: currentLanguageCode === "en" ? false : true,
    responsive: [
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 2,
        },
      },

      {
        breakpoint: 500,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };
  if (data?.length === 0 && !loading) {
    return;
  }
  return (
    <section className={`Container section_gap ${className ?? "section_p"} `}>
      <Landing_Header title="testimonials" src="2xl" />
      <div className="relative">
        <img
          alt="quote"
          src={QuoteImg}
          className="w-12 h-12 absolute top-[-25px] left-[-10px] z-20"
        />
        {loading ? (
          <div className="grid gap-5 sm:gap-10 lg:gap-20 grid-cols-1 xs:grid-cols-2 lg:grid-cols-3">
            <TestimonialsSkeleton />
          </div>
        ) : (
          <Slider {...settings}>
            {data?.map((item) => (
              <div key={item?.id} className=" max-w-[380px] px-1 ">
                <div className="h-[300px]  gap-1.5 glass_card flex flex-col gap-1.5 ">
                  {item?.user?.avatar ? (
                    <img
                      src={item?.user?.avatar}
                      alt="avatar"
                      className="mx-auto flex w-12 h-12 rounded-full border-[3px] border-primary-5 object-full"
                    />
                  ) : (
                    <div className="mx-auto flex w-12 h-12 rounded-full border-[3px] border-primary-5 object-full bg-primary-light" />
                  )}
                  <strong className="text-base leading-[32px]  text-[#201F2E] truncate ] font-semibold  ">
                    {item?.user?.full_name}
                  </strong>
                  <p className="truncate text-[#6E6C83] text-sm leading-[32px]  ">
                    {item?.user?.role}
                  </p>
                  <p className="text-primary-2 text-center text-xs line-clamp-3">
                    {item?.content}
                  </p>
                </div>
              </div>
            ))}
          </Slider>
        )}
        <img
          alt="quote"
          src={QuoteImg}
          className="w-12 h-12 absolute bottom-[-25px] right-[4%] z-20 rotate-180"
        />
      </div>
    </section>
  );
};
const TestimonialsSkeleton = () => {
  return (
    <>
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="bg-gray-50 h-[300px] flex flex-col items-center justify-center gap-6 p-8 border-[4px] border-gray-100  rounded-lg "
        >
          <header className="flex_center flex-col gap-4">
            <Skeleton
              width="46px"
              height="46px"
              shape="circle"
              className="!bg-gray-200"
            />
            <Skeleton width="100px" height="10px" className="!bg-gray-200" />
          </header>
          <Skeleton
            height="12px"
            borderRadius="16px"
            className="!bg-gray-200"
          />
          <div className="flex flex-col items-center justify-center gap-1 w-full">
            <Skeleton
              width="100%"
              height="12px"
              borderRadius="16px"
              className="!bg-gray-200"
            />
            <Skeleton
              width="80%"
              height="12px"
              borderRadius="16px"
              className="!bg-gray-200"
            />
            <Skeleton
              width="70%"
              height="12px"
              borderRadius="16px"
              className="!bg-gray-200"
            />
          </div>
        </div>
      ))}
    </>
  );
};
export default Testimonials;
