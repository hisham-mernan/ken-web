import React from "react";
import { useTranslation } from "react-i18next";

const Auth_Header = ({ className = "", title = "", des = "" }) => {
  const { t } = useTranslation();
  return (
    <header className={`${className} flex flex-col gap-2.5`}>
      <h1 className="display_sm text-dark">{t(title)}</h1>
      <p className="body_lg text-dark">{t(des)}</p>
    </header>
  );
};

export default Auth_Header;
