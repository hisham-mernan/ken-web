import React, { useEffect, useRef, useState } from "react";

import { LogoLetter, Vector } from "../../../../assets/images/Image";
import { currentLanguageCode } from "../../../../utils/switchLang";
import Arch_Wrapper from "../../../../components/shared/card/Arch_Wrapper";

const Story_Item = ({ data, isLastIndex, isFirstIndex }) => {
  const ref = useRef(null);
  const [isActive, setIsActive] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsActive(true);
        }
      },
      {
        threshold: 0.1,
      }
    );

    if (ref.current) observer.observe(ref.current);
    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  return (
    <section
      ref={ref}
      className={`${
        isLastIndex ? "" : "pb-20"
      } story_container grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-2 transition-all duration-700 ease-out ${
        isActive
          ? "active opacity-100 translate-y-0"
          : "opacity-0 translate-y-10"
      }`}
    >
      {/* start content */}
      <div className="story_container_content ms-16 flex flex-col justify-center text-center md:text-start max-w-[473px] gap-4 xl:gap-7 ">
        <q className="font-open-sans font-semibold italic text-base md:text-lg lg:text-xl xl:text-2xl text-[#2D2D2D">
          {currentLanguageCode === "en" ? data?.title : data?.title_ar}
        </q>
        <p
          className="text-body text-sm md:text-base lg:text-lg  xl:text-xl"
          dangerouslySetInnerHTML={{
            __html:
              currentLanguageCode === "en"
                ? data?.description
                : data?.description_ar,
          }}
        />
      </div>
      {/* end content */}
      <figure className="flex justify-center  md:justify-end ms-10 sm:ms-0">
        <Arch_Wrapper
          image={data?.image}
          alt="hut image"
          className="hut_primary md:!w-[300px] !h-[400px] xs:!h-[450px] md:!h-[400px]"
        >
          <img loading="lazy" decoding="async"
            src={Vector}
            alt="vector"
            className="absolute bottom-[-30px] start-[-20px]  w-[64px]"
          />
          {isFirstIndex && (
            <img loading="lazy" decoding="async"
              src={LogoLetter}
              alt="vector"
              className="absolute bottom-[-5px] end-[-30px]  w-[84px] rotate-[27deg]"
            />
          )}
        </Arch_Wrapper>
      </figure>
    </section>
  );
};

export default Story_Item;
