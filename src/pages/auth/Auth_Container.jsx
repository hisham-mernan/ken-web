import React from "react";

// lib
import Cookies from "js-cookie";
import { Outlet, useNavigate } from "react-router-dom";

// assets
import { AuthImage, Logo } from "../../assets/images/Image";
import { ArrowIcon } from "../../assets/icons/Icon";
import { currentLanguageCode } from "../../utils/switchLang";

const Auth_Container = () => {
  const navigate = useNavigate();
  const handleBack = () => {
    Cookies.remove("otp_timer");
    if (
      location.pathname.includes("login") ||
      location.pathname.includes("register")
    ) {
      navigate("/");
    } else {
      if (window.history.length > 2) {
        navigate(-1);
      } else {
        navigate("/");
      }
    }
  };
  return (
    <main className="auth_shell">
      <div className="auth_panel">
        <span
          onClick={handleBack}
          className={`auth_back ${
            currentLanguageCode === "en" ? "" : "rotate-180"
          }`}
        >
          <ArrowIcon width="20" height="20" />
        </span>
        <div className="auth_form">
          <Outlet />
        </div>
      </div>

      {/* Photography carries the other half, as it does on every other page.
          It was a 250-380px strip of stretched image before. */}
      <figure className="auth_media">
        <img src={AuthImage} alt="" />
        {/* The lockup used to be painted into the photograph, so it still
            showed the old brand long after the rest of the site had moved on
            and could only be changed by editing the picture. It is a real
            element now, taken from the same export as every other logo. */}
        <img className="auth_media_logo" src={Logo} alt="Ken" />
      </figure>
    </main>
  );
};

export default Auth_Container;
