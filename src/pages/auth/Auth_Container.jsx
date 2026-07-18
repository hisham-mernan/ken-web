import React from "react";

// lib
import Cookies from "js-cookie";
import { Outlet, useNavigate } from "react-router-dom";

// assets
import { AuthImage } from "../../assets/images/Image";
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
    <main className=" gap-10 h-screen sm:h-full max-w-screen-2xl mx-auto grid grid-cols-1 md:grid-cols-[1fr_250px] lg:grid-cols-[1fr_380px]">
      <div className=" px-4 py-10 flex flex-col justify-center gap-6 flex-1 2xl:px-12 2xl:py-10 h-full">
        <span
          onClick={handleBack}
          className={`flex items-center justify-center rounded-xl cursor-pointer border sm:border-[1.8px] border-secondary w-8 h-8 sm:w-10 sm:h-10 ${
            currentLanguageCode === "en" ? "" : "rotate-180"
          } `}
        >
          <ArrowIcon width="22" height="22" />
        </span>
        <div>
          <Outlet />
        </div>
      </div>
      <figure className="hidden md:flex h-fit md:h-auto w-full">
        <img
          src={AuthImage}
          alt="image"
          className="object-fill w-full h-full"
        />
      </figure>
    </main>
  );
};

export default Auth_Container;
