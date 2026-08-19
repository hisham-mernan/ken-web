import React from "react";
import { useTranslation } from "react-i18next";

const Auth_Header = ({ className = "", title = "", des = "" }) => {
  const { t } = useTranslation();
  return (
    <header className={`${className} flex flex-col gap-2.5`}>
      <h1 className="auth_title">{t(title)}</h1>
      <p className="auth_subtitle">{t(des)}</p>
    </header>
  );
};

export default Auth_Header;
