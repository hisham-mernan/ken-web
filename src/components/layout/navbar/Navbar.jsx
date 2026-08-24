import React, { useEffect, useRef, useState } from "react";
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
import { SHOW_EVENTS, SHOW_SERVICES } from "../../../config/features";
const navList = [
  { title: "home", path: "/" },
  { title: "about", path: "/about" },
  { title: "huts", path: "/huts" },
  { title: "events", path: "/event", hidden: !SHOW_EVENTS },
  { title: "services", path: "/services", hidden: !SHOW_SERVICES },
  { title: "booking", path: "/my-booking", onlyShowForAuth: true },
  { title: "profile", path: "/profile", onlyShowForAuth: true },
].filter((item) => !item.hidden);
const Navbar = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const isHome = location?.pathname?.endsWith("/");
  const { token, user, logout } = useAuth();
  const [toggleNav, setToggleNav] = useState(false);
  const { role } = getUserRole();
  const profileRef = useRef(null);
  // The design system's navbar is transparent over hero photography and takes
  // on a solid surface once the page scrolls past it, so the links stay legible
  // against page content rather than relying on the blur alone.
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  // The white logo/icons/button variants only belong over the transparent,
  // over-photo bar. Once the page scrolls, the bar goes solid even on the
  // homepage, so every color decision below has to key off this, not off
  // `isHome` alone -- otherwise the scrolled homepage bar keeps white-on-white.
  const overPhoto = isHome && !scrolled;
  const toggleProfile = (e) => {
    profileRef.current.toggle(e);
  };
  return (
    <>
      <header
        className={`navbar ${scrolled ? "is_scrolled" : ""} ${
          overPhoto ? "is_over_photo" : ""
        }`}
      >
        <nav className="navbar_inner">
          <Link to="/" className="outline-none">
            <img
              src={overPhoto ? LogoWhite : Logo}
              alt="logo"
              className="w-[70px]"
            />
          </Link>
          <ul className="navbar_links">
            {navList?.map((item) =>
              item?.title === "booking" || item?.title === "profile" ? null : (
                <li key={item.title}>
                  <NavLink
                    className={({ isActive }) =>
                      `navbar_link ${isActive ? "is_active" : ""}`
                    }
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
                  <UserIcon2 fill={overPhoto ? "#FFFDFD" : "#2E301A"} />
                </span>
              )}
            </div>
            {token && role === "guest" ? (
              <div>
                <Button
                  type="glass_40"
                  to="/my-booking"
                  className={`!hidden lg:!flex !rounded-full !h-[40px] min-w-[100px]  text-nowrap !text-base !font-semibold backdrop-blur-2xl ${
                    overPhoto ? "" : "text-primary-dark!"
                  }`}
                >
                  {t("booking")}
                </Button>
              </div>
            ) : (
              <div className="lg:flex  items-center hidden  gap-1 md:gap-2 ">
                <Button
                  to="/account/register"
                  type={overPhoto ? "glass_gradiant" : "glass_40"}
                  className={`!rounded-full !h-[40px] w-fit min-w-[100px] px-[14px] !text-base font-semibold! ${
                    overPhoto ? "" : "text-primary-dark! shadow hover:bg-black/10!"
                  } `}
                >
                  {t("sign_up")}
                </Button>
                <Button
                  to="/account/login"
                  type={overPhoto ? "glass_40" : "glass_gradiant_light"}
                  className={`!rounded-full  !h-[40px]  w-fit min-w-[100px] px-[14px] min-w-[100px]  text-nowrap !text-base font-semibold! ${
                    overPhoto ? "" : "text-primary-dark"
                  } `}
                >
                  {t("login")}
                </Button>
              </div>
            )}

            <span
              className={`cursor-pointer flex items-center justify-center  lg:hidden w-10 h-10 rounded-full  ${
                overPhoto ? "glass_effect_40" : "glass_effect_gradiant_light"
              } `}
              role="button"
              onClick={() => setToggleNav(true)}
            >
              <BurgerIcon fill={overPhoto ? "#FFFDFD" : "#2E301A"} />
            </span>
            <span
              className={`cursor-pointer flex items-center justify-center w-10 h-10 rounded-full  ${
                overPhoto ? "glass_effect_40" : "glass_effect_gradiant_light"
              } `}
              role="button"
              onClick={switchLang}
            >
              <LangIcon fill={overPhoto ? "#FFFDFD" : "#2E301A"} />
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
