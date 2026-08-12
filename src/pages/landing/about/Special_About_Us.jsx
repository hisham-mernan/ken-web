import React from "react";

import { currentLanguageCode } from "../../../utils/switchLang";
import { useTranslation } from "react-i18next";
import useGetData from "../../../hooks/useGetData";
import { API } from "../../../service/apiUrl";
import { Skeleton } from "primereact/skeleton";
import Landing_Header from "../../../components/layout/header/Landing_Header";
import { getImageUrl } from "../../../utils/getImageUrl";

const defaultSpecial = [
  { id: 1, title: "BUILT BY SAUDI HANDS", title_ar: "بُني بأيدي سعودية", image: "uploads/content/about_us/main.jpg" },
  { id: 2, title: "LUXURIOUS EXPERIENCE", title_ar: "تجربة كوخ فاخرة", image: "uploads/services/hut_image/DSC_0046_2.jpg" },
  { id: 3, title: "STRATEGIC LOCATION", title_ar: "موقع استراتيجي", image: "uploads/content/story/story1.jpg" },
  { id: 4, title: "FAMILY PROJECT", title_ar: "مشروع عائلي", image: "uploads/services/service_image/dining.jpg" },
  { id: 5, title: "SMART ENTRY", title_ar: "دخول ذكي", image: "uploads/services/hut_image/DSC_0080_2.jpg" },
  { id: 6, title: "NATURAL WOOD", title_ar: "خشب طبيعي", image: "uploads/services/service_image/spa.jpg" },
];

const Special_About_Us = () => {
  const { t } = useTranslation();
  const { data, loading } = useGetData(API.about.special_about_us);
  const items = data && data.length > 0 ? data : defaultSpecial;

  return (
    <section className="Container flex flex-col gap-10 section_p">
      <Landing_Header title="special_about_us" src="xl" />
      <div className="flex flex-col gap-4 lg:gap-6">
        {loading ? (
          <div className="h-[130px] lg:h-[180px] rounded-lg">
            <Skeleton height="100%" className="!bg-gray-200" />
          </div>
        ) : (
          items.map((item, idx) => (
            <figure
              key={item?.id || idx}
              className="h-[110px] sm:h-[140px] lg:h-[160px] rounded-lg relative overflow-hidden group shadow-sm"
            >
              <img
                src={getImageUrl(item?.image)}
                alt={item?.title}
                className="w-full h-full object-center object-cover rounded-lg transform group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/45 rounded-lg transition-opacity duration-300" />
              <figcaption className="text-white font-bold tracking-[2px] truncate max-w-[90%] z-10 text-xl sm:text-2xl xl:text-3xl absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 text-center uppercase">
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
