import React from "react";
import { LogoLetter, LogoLg, LogoWhite } from "../../../../assets/images/Image";
import { useTranslation } from "react-i18next";
import Button from "../../../../components/shared/Button";

const email = import.meta.env.VITE_REACT_APP_KEN_EMAIL;
const Booking_Contact = () => {
  const { t } = useTranslation();
  return (
    <section
      className={`w-full bg-main py-10  relative rounded-sm min-h-[249px] flex flex-col items-center justify-center `}
    >
      <img loading="lazy" decoding="async"
        src={LogoLg}
        className={` absolute top-0 start-0 w-[40px] sm:w-[60px] `}
      />
      <div className="relative z-10 flex flex-col md:flex-row items-center md:justify-center gap-4 xl:gap-20 w-full max-w-[90%] md:max-w-[789px] mx-auto ">
        <h2 className=" font-bold text-primary-2 text-2xl lg:text-3xl xl:text-[32px]">
          {t("do_you_need_help")}
        </h2>
        <Button
          rounded="full"
          to="/contact"
          className={`max-w-full sm:max-w-[300px] lg:max-w-[350px] ${
            location.pathname.includes("contact")
              ? "!cursor-default"
              : "!cursor-pointer"
          } `}
        >
          {t("contact_us")}
        </Button>
      </div>
      <img loading="lazy" decoding="async"
        src={LogoLetter}
        className="absolute bottom-[12%] start-[4%] md:end-[10%] w-[40px] sm:w-[50px]  "
        alt="vector"
      />
      <img loading="lazy" decoding="async"
        src={LogoWhite}
        className="absolute bottom-9 end-[-5%] w-[100px] sm:w-[120px] md:w-[180px] lg:w-[250px] "
      />
    </section>
  );
};

export default Booking_Contact;
