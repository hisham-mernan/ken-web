import React, { useEffect, useRef, useState } from "react";
// lib
import { Skeleton } from "primereact/skeleton";
import { useTranslation } from "react-i18next";

import { Accordion, AccordionTab } from "primereact/accordion";

import useGetData from "../../../hooks/useGetData";
import { API } from "../../../service/apiUrl";
import { currentLanguageCode } from "../../../utils/switchLang";
import { ArrowIcon } from "../../../assets/icons/Icon";
import Branded_Section from "../../../components/shared/Branded_Section";
import { useLocation, useNavigate } from "react-router-dom";
import Landing_Header from "../../../components/layout/header/Landing_Header";

const Faq = () => {
  const { t } = useTranslation();
  const { data, loading } = useGetData(API.home.faq);
  const [activeIndex, setActiveIndex] = useState(null);
  const faqContainerRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const section = params.get("scroll");

    if (
      section === "faq" &&
      !loading &&
      data?.length > 0 &&
      faqContainerRef.current
    ) {
      const top =
        faqContainerRef.current.getBoundingClientRect().top + window.scrollY;

      window.scrollTo({ top: top, behavior: "smooth" });

      params.delete("scroll");
      const newSearch = params.toString();
      navigate(
        { pathname: location.pathname, search: newSearch },
        { replace: true }
      );
    }
  }, [location.search, data, loading, navigate, location.pathname]);
  const toggleIcon = (index) => {
    return activeIndex === index ? (
      <span className="rotate-90">
        <ArrowIcon />
      </span>
    ) : (
      <span className="rotate-270">
        <ArrowIcon />
      </span>
    );
  };

  const onAccordionChange = (e) => {
    setActiveIndex(e.index);
  };

  if (!loading && data?.length === 0) {
    return;
  }
  return (
    <div ref={faqContainerRef} className="Container" id="faq">
      <section className="section_p">
        <div className=" z-10 relative max-w-[95%]  md:max-w-[870px]  mx-auto flex flex-col gap-5 md:gap-10 ">
          <Landing_Header title="faq" src="faq" />
          <div className="faq">
            <Accordion
              activeIndex={activeIndex}
              onTabChange={onAccordionChange}
            >
              {loading
                ? [1].map((_, index) => (
                    <AccordionTab
                      key={index}
                      header={<Skeleton height="20px"></Skeleton>}
                    >
                      <Skeleton className="h-1.5 mb-2"></Skeleton>
                      <Skeleton width="90%" className=" h-1.5 mb-2"></Skeleton>
                    </AccordionTab>
                  ))
                : data?.map((item, index) => (
                    <AccordionTab
                      key={index}
                      header={
                        <div className="flex items-center justify-between ">
                          <p
                            className={`text-base md:text-xl text-[#0A1F1A] font-semibold  `}
                          >
                            {currentLanguageCode === "en"
                              ? item.question
                              : item.question_ar}
                          </p>
                          {toggleIcon(index)}
                        </div>
                      }
                    >
                      <p
                        className={`text-[#0A1F1A] text-sm md:text-base font-[300] `}
                      >
                        {currentLanguageCode === "en"
                          ? item.answer
                          : item.answer_ar}
                      </p>
                    </AccordionTab>
                  ))}
            </Accordion>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Faq;
