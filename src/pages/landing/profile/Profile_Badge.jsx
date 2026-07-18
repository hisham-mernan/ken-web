import React from "react";
import { StarBadgeImg } from "../../../assets/images/Image";
import { useTranslation } from "react-i18next";
import { Star2Icon, StarIcon } from "../../../assets/icons/Icon";

const Profile_Badge = () => {
  const { t } = useTranslation();
  return (
    <section className="primary_gradiant flex-col sm:flex-row px-4 md:px-8 lg:px-12 py-5 sm:py-[28px] rounded-2xl flex items-center text-center sm:text-start gap-2 md:gap-5">
      <span className="star_gradiant flex flex-col items-center justify-center w-11 h-11 sm:w-14 sm:h-14 rounded-full">
        <Star2Icon />
      </span>
      <div className="flex-1 grid gap-1">
        <h2 className="text-[#E8D5A8] text-base md:text-xl lg:text-[22px] font-bold">
          {t("badge_title")}
        </h2>
        <p className="font-light text-[#9C9E90CC] text-xs md:text-sm">
          {t("badge_des")}
        </p>
      </div>
      <span className="text-[#E8D5A8] text-[13px] font-semibold tracking-[1px] flex h-[33px] items-center justify-center text-center border border-[#C9A96E4D] py-2 px-6 rounded-full bg-[#C9A96E26]">
        {t("gold_member")}
      </span>
    </section>
  );
};

export default Profile_Badge;
