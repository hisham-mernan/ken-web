import React from "react";

// lib
import { Skeleton } from "primereact/skeleton";
import { useTranslation } from "react-i18next";

// assets
import { CarIcon } from "../../../../../assets/icons/Icon";
import { currentLanguageCode } from "../../../../../utils/switchLang";
import GoogleMap from "../../../../../components/shared/map/Map";

const Location = ({ loading = false, data }) => {
  const { t } = useTranslation();
  const address =
    currentLanguageCode === "en" ? data?.address : data?.address_ar;
  if (loading) {
    return (
      <section className=" flex flex-col gap-4 ">
        <h2 className="text-secondary title_lg !font-bold">{t("location")}</h2>
        <Skeleton height="240px" />
      </section>
    );
  }

  return (
    <section className=" flex flex-col gap-4 ">
      <h2 className="text-secondary title_lg !font-bold">{t("location")}</h2>
      {data?.latitude && data?.longitude && (
        <GoogleMap markerPosition={[data?.latitude, data?.longitude]} />
      )}
      {/* Address is optional: the huts share one site, so the pin on the map is
          the location and there is no per-hut address to spell out. Icon and
          text render together -- the icon on its own left a stray marker under
          the map with nothing beside it. */}
      {address && (
        <div className="flex_center_y gap-2.5">
          <CarIcon />
          <p className="text-primary-3 text-[15px]  !font-normal">{address}</p>
        </div>
      )}
    </section>
  );
};

export default Location;
