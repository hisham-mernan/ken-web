import React from "react";

import { currentLanguageCode } from "../../../utils/switchLang";
import { useTranslation } from "react-i18next";
import useGetData from "../../../hooks/useGetData";
import { API } from "../../../service/apiUrl";
import { Skeleton } from "primereact/skeleton";
import Landing_Header from "../../../components/layout/header/Landing_Header";

const Special_About_Us = () => {
  const { t } = useTranslation();
  const { data, loading } = useGetData(API.about.special_about_us);
  if (data?.length === 0) {
    return null;
  }
  return (
    <section className="Container  flex flex-col gap-10 section_p ">
      <Landing_Header title="special_about_us" src="xl" />
      <div className="flex flex-col gap-6 xl:gap-16">
        {loading ? (
          <div className="h-[130px] lg:h-[211px] rounded-lg">
            <Skeleton height="100%" className="!bg-gray-200" />
          </div>
        ) : (
          data?.map((item) => (
            <figure
              key={item?.id}
              className="h-[130px] lg:h-[211px] rounded-lg right_gradient"
            >
              <img
                src={item?.image}
                alt={item?.title}
                className="w-full h-full object-center object-cover rounded-lg"
              />
              <figcaption className=" text-font-light truncate max-w-[80%] z-10 text-2xl sm:text-3xl xl:text-4xl absolute top-[50%] left-[50%] translate-[-50%] ">
                {currentLanguageCode === "en" ? item?.title : item?.title_ar}
              </figcaption>
            </figure>
          ))
        )}
      </div>
    </section>
  );
};

export default Special_About_Us;
