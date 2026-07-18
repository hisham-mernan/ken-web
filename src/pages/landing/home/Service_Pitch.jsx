import React from "react";

import { SerivePitchImg } from "../../../assets/images/Image";
import { useTranslation } from "react-i18next";
import Button from "../../../components/shared/Button";
import Arch_Wrapper from "../../../components/shared/card/Arch_Wrapper";

const Service_Pitch = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n?.language == "ar";
  return (
    <section className="section_p Container flex flex-col md:flex-row items-center gap-10 lg:gap-16 2xl:gap-[117px] ">
      <Arch_Wrapper
        image={SerivePitchImg}
        alt="image"
        // className=""
        className={`primary ${isRtl ? "md:order-2" : ""}`}
      />
      {/* content */}
      <div
        className={`flex-1 flex flex-col text-center md:text-start gap-4 ${
          isRtl ? "md:order-1" : ""
        }`}
      >
        <h2 className=" text-[30px] sm:text-[40px] md:text-[30px] lg:text-[48px] leading-normal font-bold text-primary-4">
          {t("service_pitch_title")}
        </h2>
        <div className="max-w-[687px]  flex flex-col items-center md:items-start gap-8 2xl:gap-10">
          <p className="text-secondary-1  text-sm lg:text-lg  2xl:text-2xl max-w-[640px]">
            {t("service_pitch_des")}
          </p>
          <Button
            to="/account/supplier"
            type="primary_light"
            hasFullWidth={false}
            className="min-w-[342px] rounded-full! !w-fit"
          >
            {t("contact_us")}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Service_Pitch;
