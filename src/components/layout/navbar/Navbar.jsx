import React, { useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Logo, LogoLight, LogoWhite } from "../../../assets/images/Image";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../../context/Auth_Context";
import {
  BurgerIcon,
  CloseCircleIconOutline,
  LangIcon,
  LogoutIcon,
  UserIcon2,
} from "../../../assets/icons/Icon";
import { currentLanguageCode, switchLang } from "../../../utils/switchLang";
import Button from "../../shared/Button";
import { getUserRole } from "../../../utils/auth";
import { OverlayPanel } from "primereact/overlaypanel";
import { useOutsideClick } from "./../../../hooks/useOutsideClick";

import { getImageUrl, IMG } from "../../../utils/getImageUrl";
const navList = [
  { title: "home", path: "/" },
  { title: "about", path: "/about" },
  { title: "huts", path: "/huts" },
  { title: "events", path: "/event" },
  { title: "services", path: "/services" },
  { title: "booking", path: "/my-booking", onlyShowForAuth: true },
  { title: "profile", path: "/profile", onlyShowForAuth: true },
];
const Navbar = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const isHome = location?.pathname?.endsWith("/");
  const { token, user, logout } = useAuth();
  const [toggleNav, setToggleNav] = useState(false);
  const { role } = getUserRole();
  const profileRef = useRef(null);
  const toggleProfile = (e) => {
    profileRef.current.toggle(e);
  };
  return (
    <>
      <header
        className={`max-w-[1536px] navbar w-[calc(100%-40px)] sm:w-[calc(100%-94px)] mx-auto border border-white/20 ${
          isHome ? "bg-[#7B7A7C14]  " : "bg-[#9B9B9B14] "
        } py-[6px] px-4 sm:px-6 rounded-full backdrop-blur-xl mx-auto  absolute z-40 top-[32px] left-[50%] translate-x-[-50%]`}
      >
        <nav className=" w-full  flex items-center gap-2 justify-between   ">
          <Link to="/" className="outline-none">
            <img
              src={isHome ? LogoWhite : Logo}
              alt="logo"
              className="w-[70px]"
            />
          </Link>
          <ul className="hidden lg:flex items-center gap-4 lg:gap-8 xl:gap-11">
            {navList?.map((item) =>
              item?.title === "booking" || item?.title === "profile" ? null : (
                <li key={item.title}>
                  <NavLink
                    className={`relative outline-none ${
                      isHome ? "text-white" : "text-primary-dark"
                    } text-base font-normal hover:font-bold transition-all ease-in-out duration-300`}
                    to={item.path}
                  >
                    {t(item?.title)}{" "}
                  </NavLink>
                </li>
              )
            )}
          </ul>
          <div className={`flex items-center gap-1 md:gap-2 `}>
            <div className="flex items-center gap-1">
              {token && role === "guest" && (
                <span
                  className={` cursor-pointer hidden md:flex items-center justify-center w-10 h-10 rounded-full glass_effect_40 `}
                  onClick={(e) => toggleProfile(e)}
                >
                  <UserIcon2 fill={isHome ? "#FFFDFD" : "#2E301A"} />
                </span>
              )}
            </div>
            {token && role === "guest" ? (
              <div>
                <Button
                  type="glass_40"
                  to="/my-booking"
                  className={`!hidden lg:!flex !rounded-full !h-[40px] min-w-[100px]  text-nowrap !text-base !font-semibold backdrop-blur-2xl ${
                    isHome ? "" : "text-primary-dark!"
                  }`}
                >
                  {t("booking")}
                </Button>
              </div>
            ) : (
              <div className="lg:flex  items-center hidden  gap-1 md:gap-2 ">
                <Button
                  to="/account/register"
                  type={isHome ? "glass_gradiant" : "glass_40"}
                  className={`!rounded-full !h-[40px] w-fit min-w-[100px] px-[14px] !text-base font-semibold! ${
                    isHome ? "" : "text-primary-dark! shadow hover:bg-black/10!"
                  } `}
                >
                  {t("sign_up")}
                </Button>
                <Button
                  to="/account/login"
                  type={isHome ? "glass_40" : "glass_gradiant_light"}
                  className={`!rounded-full  !h-[40px]  w-fit min-w-[100px] px-[14px] min-w-[100px]  text-nowrap !text-base font-semibold! ${
                    isHome ? "" : "text-primary-dark"
                  } `}
                >
                  {t("login")}
                </Button>
              </div>
            )}

            <span
              className={`cursor-pointer flex items-center justify-center  lg:hidden w-10 h-10 rounded-full  ${
                isHome ? "glass_effect_40" : "glass_effect_gradiant_light"
              } `}
              role="button"
              onClick={() => setToggleNav(true)}
            >
              <BurgerIcon fill={isHome ? "#FFFDFD" : "#2E301A"} />
            </span>
            <span
              className={`cursor-pointer flex items-center justify-center w-10 h-10 rounded-full  ${
                isHome ? "glass_effect_40" : "glass_effect_gradiant_light"
              } `}
              role="button"
              onClick={switchLang}
            >
              <LangIcon fill={isHome ? "#FFFDFD" : "#2E301A"} />
            </span>
          </div>
        </nav>
      </header>
      <MobileNavbar
        list={navList}
        setToggleNav={setToggleNav}
        toggleNav={toggleNav}
      />
      <OverlayPanel
        ref={profileRef}
        className=" hidden md:flex flex-col w-[180px]  p-1 secondary_border "
      >
        <div className="flex flex-col gap-2">
          <Link
            to="/profile"
            className="main_shadow p-1.5 rounded-lg bg-white hover:bg-light  transition-all ease-in-out duration-300  flex_center_y gap-2 "
          >
            <figure className=" w-7 h-7 rounded-full">
              {user?.avatar ? (
                <img
                  src={getImageUrl(user?.avatar, { width: IMG.avatar })}
                  alt="logo"
                  className="h-full w-full rounded-full border-[.5px] border-on-surface-outline-variant"
                />
              ) : (
                <span className=" cursor-pointer hidden md:flex items-center justify-center w-full h-full bg-primary-dark rounded-full">
                  <UserIcon2 />
                </span>
              )}
            </figure>
            <p className="flex-1 text-grey-500 body_lg line-clamp-1 font-medium">
              {user?.full_name ?? "-"}
            </p>
          </Link>

          {/* footer */}
          <div className="w-full flex flex-col">
            <Button
              hasFullWidht
              type="light"
              size="md"
              textSize="base"
              iconRight={
                <LogoutIcon
                  fill="var(--color-secondary-4)"
                  width="20"
                  height="20"
                />
              }
              onClick={(e) => {
                logout();
                toggleProfile(e);
              }}
            >
              {t("logout")}
            </Button>
          </div>
        </div>
      </OverlayPanel>
    </>
  );
};
const MobileNavbar = ({ toggleNav, setToggleNav }) => {
  const { t } = useTranslation();
  const { token, logout } = useAuth();
  const { role } = getUserRole();
  const ref = useOutsideClick(() => setToggleNav(false));
  return (
    <div
      className={`  ${
        toggleNav ? "opacity-100" : "opacity-0 invisible"
      } mobile_navbar flex flex-col lg:hidden fixed inset-0 overflow-y-hidden  backdrop-blur-sm  z-50 top-0  bottom-0 right-0 left-0`}
    >
      <aside
        ref={ref}
        className={`bg-white/90 backdrop-blur-xl border border-[#DBBBFC33] rounded-s-xl pt-7 pb-10 px-4 w-[300px]  overflow-y-auto fixed top-0 bottom-0  ${
          currentLanguageCode === "en" ? "right-0" : "left-0"
        } flex flex-col gap-10`}
      >
        <header className="flex items-center justify-between">
          <Link
            to="/"
            onClick={() => {
              setToggleNav(false);
            }}
          >
            <img src={Logo} alt="logo" className="w-[80px] object-cover" />
          </Link>
          <span
            role="button"
            onClick={() => setToggleNav(false)}
            className="cursor-pointer"
          >
            <CloseCircleIconOutline
              fill="var(--color-primary-dark)"
              xFill="var(--color-primary-dark)"
            />
          </span>
        </header>
        <div className="flex-1 flex flex-col justify-between">
          <nav className="nav_mobile flex flex-col gap-7 ">
            {navList?.map(
              (item) =>
                (!item?.onlyShowForAuth ||
                  (item?.onlyShowForAuth && token && role === "guest")) && (
                  <NavLink
                    key={item?.path}
                    to={item?.path}
                    onClick={() => {
                      setToggleNav(false);
                    }}
                    className="navlink w-fit  text-primary-dark text-sm capitalize transition-all ease-in-out duration-300 relative "
                  >
                    {t(item?.title)}
                  </NavLink>
                )
            )}
          </nav>
          <footer className="flex flex-col gap-2">
            {token ? (
              <div
                onClick={logout}
                className="flex_center_y gap-2 cursor-pointer "
              >
                <span
                  className={currentLanguageCode === "en" ? "" : "rotate-180"}
                >
                  <LogoutIcon fill="var(--color-primary-dark)" />
                </span>
                <span className="text-primary-dark ">{t("logout")}</span>
              </div>
            ) : (
              <Link className="flex_center_y gap-2" to="/account/login">
                <span className="rotate-180">
                  <LogoutIcon fill="var(--color-primary-dark)" />
                </span>
                <span className="text-primary-dark ">{t("login")}</span>
              </Link>
            )}
          </footer>
        </div>
      </aside>
    </div>
  );
};
export default Navbar;
