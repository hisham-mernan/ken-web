import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  TiktokIcon,
  FooterImg,
  InstgramIcon,
  LogoLight,
} from "../../../assets/images/Image";
import { useTranslation } from "react-i18next";
import Footer_Link_item from "./components/dropdown/Footer_Link_item";
import { useAuth } from "../../../context/Auth_Context";
import Language_Dropdown from "./components/dropdown/Language_Dropdown";
import { SHOW_EVENTS, SHOW_SERVICES } from "../../../config/features";

const email = import.meta.env.VITE_REACT_APP_KEN_EMAIL;
const phone = import.meta.env.VITE_REACT_APP_KEN_PHONE;
const socialLink = [
  {
    img: TiktokIcon,
    path: "https://www.tiktok.com/@ken.countryside?_t=ZS-8z2AYC42cLg&_r=1",
    alt: "tiktok",
  },
  {
    img: InstgramIcon,
    path: "https://www.instagram.com/ken.countryside?igsh=ZzJhM2c0cDVjMzFk&utm_source=qr",
    alt: "instagram",
  },
];
const homeList = [
  { title: "home", path: "/" },
  { title: "about_us", path: "/about" },
  { title: "huts", path: "/huts" },
  { title: "events", path: "/event", hidden: !SHOW_EVENTS },
  { title: "services", path: "/services", hidden: !SHOW_SERVICES },
].filter((item) => !item.hidden);
const contactUsList = [
  { title: email, underline: true },
  {
    title: phone,
    dir: "ltr",
    action: () => {
      window.location.href = `tel:${phone}`;
    },
  },
];
const Footer = () => {
  const { t } = useTranslation();
  const { token } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const moreList = [
    token ? { title: "booking", path: "/my-booking" } : null,
    token ? { title: "profile", path: "/profile" } : null,
    { title: "language", dropdown: <Language_Dropdown /> },
  ];
  const handleFaqClick = () => {
    if (location.pathname === "/") {
      // already on home → scroll directly
      const el = document.getElementById("faq");
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      // not on home → navigate then scroll
      navigate("/?scroll=faq");
    }
  };
  const supportList = [
    {
      title: "faq",
      action: () => {
        handleFaqClick();
      },
    },
    { title: "terms_and_conditions", path: "/terms-and-conditions" },
  ];
  return (
    <footer className="footer_ds bg-primary relative px-4 py-[30px] sm:py-16 sm:px-12  lg:py-20 lg:px-16 2xl:py-[116px] 2xl:px-[130px] ">
      <div className=" relative z-10 grid grid-cols-3  md:flex flex-wrap  items-start justify-between gap-y-8 gap-x-4">
        {/* start basic info */}

        <div className="flex flex-col gap-4 md:gap-6 text-primary-light col-span-3 ">
          <Link to="/">
            <img loading="lazy" decoding="async" src={LogoLight} className="h-[20px]" alt="logo" />
          </Link>
          <p className=" text-sm md:text-lg">{t("ken_footer")}</p>
          <a
            href={`https://mail.google.com/mail/?view=cm&fs=1&to=${email}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex md:hidden underline  text-sm  md:text-base text-primary-light"
          >
            {email}
          </a>
          <button
            className=" text-primary-light flex md:hidden outline-none shadow-none cursor-pointer  text-sm  md:text-base capitalize w-fit "
            dir="ltr"
            onClick={() => {
              window.location.href = `tel:${phone}`;
            }}
          >
            {phone}
          </button>

          <div className="flex items-center gap-5">
            {socialLink.map((item, i) => (
              <Link
                to={item.path}
                key={i}
                target="_blank"
                aria-label={item?.alt}
              >
                <img loading="lazy" decoding="async"
                  src={item.img}
                  alt={item.alt}
                  className="w-4 h-4 md:w-5 md:h-5"
                />
              </Link>
            ))}
          </div>
        </div>
        {/* end basic info */}

        <Footer_Link_item
          title="contact_us"
          list={contactUsList}
          className="hidden md:flex"
        />
        <Footer_Link_item title="main_pages" list={homeList} />
        <Footer_Link_item title="support" list={supportList} />
        <Footer_Link_item title="more" list={moreList} />
      </div>
      <img loading="lazy" decoding="async"
        src={FooterImg}
        className="absolute bottom-0 right-0 w-[600px]  z-[1]"
      />
    </footer>
  );
};

export default Footer;
