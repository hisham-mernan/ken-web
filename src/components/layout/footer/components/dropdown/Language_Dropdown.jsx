import React, { useState } from "react";
import {
  currentLanguageCode,
  toggleLang,
} from "../../../../../utils/switchLang";

import { useTranslation } from "react-i18next";
import { Dropdown } from "primereact/dropdown";
const list = [
  { name: "En", value: "en" },
  { name: "العربية", value: "ar" },
];
const Language_Dropdown = () => {
  const { t } = useTranslation();
  return (
    <div className="transparent_dropdown">
      <Dropdown
        value={currentLanguageCode}
        onChange={(e) => toggleLang(e.value)}
        options={list?.map((item) => ({
          name: item?.name,
          value: item?.value,
        }))}
        optionLabel="name"
        placeholder={t("language")}
        className="w-full min-w-[100px] "
      />
    </div>
  );
};

export default Language_Dropdown;
