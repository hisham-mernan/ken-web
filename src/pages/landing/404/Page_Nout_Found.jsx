import React from "react";
import { PageNotFoundImg } from "../../../assets/images/Image";
import Button from "../../../components/shared/Button";
import { useTranslation } from "react-i18next";

const Page_Nout_Found = ({ text, btnName = "back_to_home", btnLink = "/" }) => {
  const { t } = useTranslation();
  return (
    <section className="Container page_p pb-20 md:pb-[200px] ">
      <div className="flex_center flex-col gap-20">
        <img
          src={PageNotFoundImg}
          className="w-[300px] sm:w-[400px] md:w-[667px] object-cover"
        />
        <div className=" flex flex-col w-full items-center justify-center text-center  gap-10">
          {text && (
            <p className="text-secondary max-w-[600px] text-center text-sm md:text-base lg:text-xl ">
              {t(text)}
            </p>
          )}
          <Button
            type="secondary"
            className="w-full max-w-[300px]"
            to={btnLink}
          >
            {t(btnName)}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Page_Nout_Found;
