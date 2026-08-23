import React, { useEffect, useRef, useState } from "react";
import useReveal from "../../../hooks/useReveal";
import { Skeleton } from "primereact/skeleton";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

import useGetData from "../../../hooks/useGetData";
import { API } from "../../../service/apiUrl";
import { currentLanguageCode } from "../../../utils/switchLang";

/**
 * FAQ in two columns, per the design system's hairline-and-typography
 * treatment. There are enough questions that a single 870px column ran far
 * down the page, so they are split across two.
 *
 * The PrimeReact accordion is gone: it allowed only one open tab at a time,
 * which across two columns means opening a question on the right silently
 * closes one on the left. These disclosures open independently.
 *
 * Questions and answers are the same FAQ endpoint, with the _ar variants.
 */
const Faq = () => {
  const { t } = useTranslation();
  const { ref, revealClass, style } = useReveal();
  const { data, loading } = useGetData(API.home.faq);
  const [open, setOpen] = useState(() => new Set());
  const faqContainerRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Deep link from the footer's FAQ link.
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (
      params.get("scroll") === "faq" &&
      !loading &&
      data?.length > 0 &&
      faqContainerRef.current
    ) {
      const top =
        faqContainerRef.current.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top, behavior: "smooth" });
      params.delete("scroll");
      navigate(
        { pathname: location.pathname, search: params.toString() },
        { replace: true }
      );
    }
  }, [location.search, data, loading, navigate, location.pathname]);

  const toggle = (index) =>
    setOpen((prev) => {
      const next = new Set(prev);
      next.has(index) ? next.delete(index) : next.add(index);
      return next;
    });

  if (!loading && data?.length === 0) return null;

  return (
    <section
      // Two refs on one node: the deep-link scroll target and the reveal
      // observer both need it.
      ref={(node) => {
        faqContainerRef.current = node;
        ref.current = node;
      }}
      id="faq"
      className={`faq_ds ${revealClass}`}
      style={style}
    >
      <header className="faq_ds_header">
        <h2 className="faq_ds_headline">{t("faq")}</h2>
      </header>

      <div className="faq_ds_grid">
        {loading
          ? Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="faq_ds_item">
                <Skeleton height="22px" />
              </div>
            ))
          : data?.map((item, index) => {
              const isOpen = open.has(index);
              return (
                <article
                  key={item?.id ?? index}
                  className={`faq_ds_item ${isOpen ? "is_open" : ""}`}
                >
                  <button
                    type="button"
                    className="faq_ds_question"
                    aria-expanded={isOpen}
                    onClick={() => toggle(index)}
                  >
                    <span>
                      {currentLanguageCode === "en"
                        ? item?.question
                        : item?.question_ar}
                    </span>
                    <span className="faq_ds_sign" aria-hidden="true" />
                  </button>
                  <div className="faq_ds_answer">
                    <p>
                      {currentLanguageCode === "en"
                        ? item?.answer
                        : item?.answer_ar}
                    </p>
                  </div>
                </article>
              );
            })}
      </div>
    </section>
  );
};

export default Faq;
