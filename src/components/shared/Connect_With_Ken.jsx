import React from "react";
import { LogoLetter, LogoLg, LogoLgLeft } from "../../assets/images/Image";
import { useTranslation } from "react-i18next";
import Button from "./Button";
import Branded_Section from "./Branded_Section";

const Connect_With_Ken = () => {
  const { t } = useTranslation();
  return (
    <Branded_Section className="!py-20  sm:!py-28 lg:!py-[100px]  2xl:!py-[200px]">
      {" "}
      <div className=" max-w-[95%]  md:max-w-[630px]  mx-auto flex flex-col items-center gap-10">
        <h3
          className="display_md text-center"
          dangerouslySetInnerHTML={{ __html: t("connect_title") }}
        />
        <Button
          rounded="full"
          to={`/huts`}
          className="max-w-[150px] sm:max-w-[400px]"
        >
          {t("book_now")}
        </Button>
      </div>
    </Branded_Section>
  );
};

export default Connect_With_Ken;
