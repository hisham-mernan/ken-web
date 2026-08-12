import React from "react";
import Landing_Header from "../../../../components/layout/header/Landing_Header";
import { currentLanguageCode } from "../../../../utils/switchLang";
import useGetData from "../../../../hooks/useGetData";
import { API } from "../../../../service/apiUrl";

// Green SVG Icons matching reference design #2
const TreeIcon = () => (
  <svg width="60" height="60" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M32 6L16 22H24L12 36H24L8 50H56L40 36H52L40 22H48L32 6Z" fill="#3A4B2C" fillOpacity="0.15" stroke="#3A4B2C" strokeWidth="3" strokeLinejoin="round"/>
    <path d="M32 46V58" stroke="#3A4B2C" strokeWidth="4" strokeLinecap="round"/>
  </svg>
);

const WoodLogsIcon = () => (
  <svg width="60" height="60" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="20" cy="44" r="10" fill="#3A4B2C" fillOpacity="0.15" stroke="#3A4B2C" strokeWidth="3"/>
    <circle cx="44" cy="44" r="10" fill="#3A4B2C" fillOpacity="0.15" stroke="#3A4B2C" strokeWidth="3"/>
    <circle cx="32" cy="24" r="10" fill="#3A4B2C" fillOpacity="0.15" stroke="#3A4B2C" strokeWidth="3"/>
    <circle cx="20" cy="44" r="3" fill="#3A4B2C"/>
    <circle cx="44" cy="44" r="3" fill="#3A4B2C"/>
    <circle cx="32" cy="24" r="3" fill="#3A4B2C"/>
    <path d="M38 18L56 34M10 34L26 18" stroke="#3A4B2C" strokeWidth="3" strokeLinecap="round"/>
  </svg>
);

const BucketIcon = () => (
  <svg width="60" height="60" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 26L18 56H46L50 26H14Z" fill="#3A4B2C" fillOpacity="0.15" stroke="#3A4B2C" strokeWidth="3" strokeLinejoin="round"/>
    <path d="M22 26V14C22 8.47715 26.4772 4 32 4C37.5228 4 42 8.47715 42 14V26" stroke="#3A4B2C" strokeWidth="3.5" strokeLinecap="round"/>
    <line x1="18" y1="36" x2="46" y2="36" stroke="#3A4B2C" strokeWidth="3"/>
    <line x1="19" y1="46" x2="45" y2="46" stroke="#3A4B2C" strokeWidth="3"/>
  </svg>
);

const defaultIcons = [<TreeIcon key="tree" />, <WoodLogsIcon key="logs" />, <BucketIcon key="bucket" />];

const defaultServices = [
  {
    id: 1,
    title: "Build",
    title_ar: "بناء وتشييد",
    description: "Natural wood structures and authentic eco-huts built by Saudi hands in scenic locations.",
    description_ar: "أكواخ ومباني خشبية طبيعية فاخرة تم بناؤها بأيدي سعودية في مواقع طبيعية ساحرة.",
  },
  {
    id: 2,
    title: "Modern Spaces",
    title_ar: "مساحة حديثة",
    description: "Luxurious modern interior spaces tailored with high-grade natural timber and smart amenities.",
    description_ar: "تصميم مساحات حديثة وعصرية مجهزة بلمسات الخشب الطبيعي وأرقى مستويات الراحة.",
  },
  {
    id: 3,
    title: "Operation & Services",
    title_ar: "إدارة وتشغيل",
    description: "Full-service resort operation, housekeeping, private dining, wellness, and eco-retreat management.",
    description_ar: "خدمات تشغيل وإدارة كاملة للمنتجعات والأكواخ مع الضيافة الفاخرة والصيانة المستمرة.",
  },
];

const Service = () => {
  const { data } = useGetData(API.about.our_service);
  const servicesList = data && data.length >= 3 ? data.slice(0, 3) : defaultServices;

  return (
    <section className="flex flex-col gap-5 md:gap-10 xl:gap-[60px]">
      <Landing_Header title="our_services" des="about_us_des" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 xl:gap-10">
        {servicesList.map((item, index) => (
          <div
            key={item?.id || index}
            className="border border-[#D6CFC4] bg-[#EAE5DC] rounded-xl p-8 flex flex-col items-center justify-center text-center gap-4 shadow-sm hover:shadow-md transition-all duration-300 min-h-[260px]"
          >
            <div className="w-16 h-16 flex items-center justify-center mb-1 text-[#3A4B2C]">
              {defaultIcons[index % 3]}
            </div>
            <h3 className="text-[#2E301A] text-xl xl:text-2xl font-bold">
              {currentLanguageCode === "en" ? item?.title : item?.title_ar}
            </h3>
            <p className="text-[#5C5E4A] text-sm xl:text-base font-normal max-w-[280px] leading-relaxed">
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
