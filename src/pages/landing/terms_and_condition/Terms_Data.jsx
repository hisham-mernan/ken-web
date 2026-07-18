import React from "react";
import { currentLanguageCode } from "../../../utils/switchLang";
import useGetData from "../../../hooks/useGetData";
import { API } from "../../../service/apiUrl";
import { Skeleton } from "primereact/skeleton";

const Terms_Data = () => {
  const { data, loading } = useGetData(API.terms_and_condtions.terms);
  const { data: termsDescription, loading: loadingDescription } = useGetData(
    API.terms_and_condtions.description
  );
 
  return (
    <section className="Container flex flex-col gap-5 md:gap-9 ">
      {loadingDescription ? (
        <div className="flex flex-col">
          <Skeleton width="100%" height="1rem" className="mb-2" />
          <Skeleton width="90%" height="1rem" className="mb-2" />
          <Skeleton width="80%" height="1rem" />
        </div>
      ) : (
        (termsDescription?.title || termsDescription?.title_ar) && (
          <p className=" text-[#696969] text-xs  sm:text-sm md:text-base lg:text-lg xl:text-xl">
            {currentLanguageCode === "en"
              ? termsDescription?.title
              : termsDescription?.title_ar}
          </p>
        )
      )}
      {loading
        ? Array.from({ length: 3 }).map((_, idx) => (
            <div
              key={idx}
              className="secondary_border p-5 lg:p-11 flex flex-col gap-3"
            >
              <Skeleton width="60%" height="1.5rem" className="mb-3" />
              <Skeleton width="100%" height="1rem" className="mb-2" />
              <Skeleton width="90%" height="1rem" className="mb-2" />
              <Skeleton width="80%" height="1rem" />
            </div>
          ))
        : data?.length > 0 &&
          data?.map((item) => (
            <div
              key={item?.id}
              className="secondary_border  p-5 lg:p-11  flex flex-col gap-3  "
            >
              <h3 className=" text-lg text-secondary-1 font-bold">
                {currentLanguageCode === "en" ? item?.title : item?.title_ar}
              </h3>
              <div
                className="revert_tailwind text-secondary-dark text-xs sm:text-sm flex flex-col gap-3"
                dangerouslySetInnerHTML={{
                  __html:
                    currentLanguageCode === "en"
                      ? item?.description
                      : item?.description_ar,
                }}
              />
            </div>
          ))}
    </section>
  );
};

export default Terms_Data;
