import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const Footer_Link_item = ({ list = [], title = "", className }) => {
  const { t } = useTranslation();
  return (
    <div
      className={`flex flex-col gap-3 md:gap-5 text-primary-light ${
        className ?? ""
      }`}
    >
      <h3 className="footer_col_heading">
        {t(title)}
      </h3>
      <div className="flex flex-col gap-3  text-sm  md:text-base">
        {list?.map(
          (item) =>
            item &&
            (item?.path ? (
              <Link
                className="footer_link"
                key={item.title}
                to={item.path}
              >
                {t(item.title)}
              </Link>
            ) : item?.action ? (
              <button
                dir={item?.dir}
                className=" outline-none shadow-none cursor-pointer  text-sm  md:text-base capitalize w-fit "
                key={item.title}
                onClick={item?.action}
              >
                {t(item.title)}
              </button>
            ) : item?.underline ? (
              <a
                href={`https://mail.google.com/mail/?view=cm&fs=1&to=${item?.title}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline  text-sm  md:text-base text-primary-light"
              >
                {item?.title}
              </a>
            ) : (
              item.dropdown
            ))
        )}
      </div>
    </div>
  );
};

export default Footer_Link_item;
