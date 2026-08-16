import React from "react";
import { useTranslation } from "react-i18next";
import { currentLanguageCode } from "../../../utils/switchLang";
import { Skeleton } from "primereact/skeleton";
import { apiKey } from "../../../service/apiUrl";

import { getImageUrl, IMG } from "../../../utils/getImageUrl";
const List = ({
  variant = "icon",
  list = [],
  containerClassName,
  listContainerClassName,
  title,
  subTitle,
  loading,
}) => {
  const { t } = useTranslation();
  if (loading) {
    return (
      <List_Skeleton
        variant={variant}
        containerClassName={containerClassName}
        subTitle={subTitle}
      />
    );
  }
  if (list?.length === 0) return null;
  return (
    <div className={`flex flex-col gap-4  ${containerClassName ?? ""} `}>
      <h2 className="text-secondary title_lg !font-bold capitalize">
        {t(title)}
      </h2>
      <div className="flex flex-col gap-2.5">
        {subTitle && (
          <h3 className=" body_lg font-bold text-primary-3 capitalize">
            {t(subTitle)}
          </h3>
        )}
        <ul
          className={`flex flex-col gap-2  max-w-[492px]  ${
            listContainerClassName ?? ""
          } `}
        >
          {list?.map((item) => (
            <li
              key={item?.name}
              className="text-primary-4 body_sm flex_center_y gap-4"
            >
              {variant === "icon" ? (
                <img loading="lazy" decoding="async"
                  src={getImageUrl(item?.icon?.image, { width: IMG.icon })}
                  alt={item?.description}
                  className="w-6 h-6 object-center object-contain"
                />
              ) : (
                <span className="flex w-2 h-2 bg-primary-4 rounded-full" />
              )}
              <p className="flex-1">
                {" "}
                {currentLanguageCode === "en"
                  ? item?.description
                  : item?.description_ar}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
const List_Skeleton = ({ containerClassName, subTitle, variant }) => {
  return (
    <div className={`flex flex-col gap-4 ${containerClassName ?? ""} `}>
      <h2 className="text-secondary title_lg !font-bold capitalize">
        <Skeleton width="150px" height="1.2rem" className="rounded-md" />
      </h2>
      <div className="flex flex-col gap-2.5">
        {subTitle && (
          <Skeleton width="150px" height="1.2rem" className="rounded-md" />
        )}
        <ul className={`flex flex-col gap-2   max-w-[492px]   `}>
          {Array.from({ length: 3 })?.map((_, idx) => (
            <li
              key={idx}
              className="text-primary-4 body_sm flex_center_y gap-4"
            >
              {variant === "icon" ? (
                <Skeleton shape="circle" size="24px" />
              ) : (
                <Skeleton shape="circle" size="8px" />
              )}
              <Skeleton width="70%" height="1rem" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
export default List;
