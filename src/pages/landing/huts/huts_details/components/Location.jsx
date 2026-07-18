import React from "react";

// lib
import { Skeleton } from "primereact/skeleton";
import { useTranslation } from "react-i18next";

// components
import Map from "../../../../../components/shared/map/Map";

// assets
import { CarIcon } from "../../../../../assets/icons/Icon";
import { currentLanguageCode } from "../../../../../utils/switchLang";
import GoogleMap from "../../../../../components/shared/map/Map";

const Location = ({ loading = false, data }) => {
  const { t } = useTranslation();
  if (loading) {
    return (
      <section className=" flex flex-col gap-4 ">
        <h2 className="text-secondary title_lg !font-bold">{t("location")}</h2>
        <Skeleton height="240px" />
        <Skeleton width="75%" />
        <Skeleton width="20%" />
      </section>
    );
  }

  return (
    <section className=" flex flex-col gap-4 ">
      <h2 className="text-secondary title_lg !font-bold">{t("location")}</h2>
      {data?.latitude && data?.longitude && (
        <GoogleMap markerPosition={[data?.latitude, data?.longitude]} />
      )}
      <p className="text-secondary title_lg !font-normal">
        {t("location_des")}
      </p>
      <div className="flex_center_y gap-2.5">
        <CarIcon />
        {data?.address && data?.address_ar && (
          <p className="text-primary-3 text-[15px]  !font-normal">
            {currentLanguageCode === "en" ? data?.address : data?.address_ar}
          </p>
        )}
      </div>
    </section>
  );
};

export default Location;
