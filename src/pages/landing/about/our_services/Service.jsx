import React from "react";
import Landing_Header from "../../../../components/layout/header/Landing_Header";

import { currentLanguageCode } from "../../../../utils/switchLang";
import useGetData from "../../../../hooks/useGetData";
import { API } from "../../../../service/apiUrl";

const Service = () => {
  const { data } = useGetData(API.about.our_service);
  if (data?.length === 0) {
    return;
  }
  return (
    <section className="flex flex-col gap-5 md:gap-10 xl:gap-[80px]">
      <Landing_Header title="our_services" des="about_us_des" />
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-4 xs:gap-6 xl:gap-[49px]">
        {data?.map((item) => (
          <div key={item?.id} className="glass_card gap-3.5">
            <img src={item?.image} alt="image" className="w-16 h-16 " />
            <h3 className="text-secondary-dark text-xl xl:text-2xl font-semibold truncate ">
              {currentLanguageCode === "en" ? item?.title : item?.title_ar}
            </h3>
            <p className="line-clamp-3 max-w-[95%] sm:max-w-[250px] text-primary-4 text-center text-base xl:text-lg">
              {currentLanguageCode === "en"
                ? item?.description
                : item?.description_ar}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Service;
