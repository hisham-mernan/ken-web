import React from "react";
import useReveal from "../../../hooks/useReveal";
import { Skeleton } from "primereact/skeleton";
import { useTranslation } from "react-i18next";

import useGetData from "./../../../hooks/useGetData";
import { API } from "../../../service/apiUrl";
import { getImageUrl, IMG } from "../../../utils/getImageUrl";

/** Up to two initials from a name, for reviewers with no avatar uploaded. */
const initialsOf = (name) => {
  const parts = String(name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (!parts.length) return "—";
  return parts
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
};

/**
 * Testimonials as the design system's card: white surface, warm shadow, 20px
 * radius, no coloured border. A grid rather than a slick carousel -- the
 * reviews are short, so paging through three at a time hid most of them behind
 * an interaction for no gain.
 *
 * The quote is no longer clamped to three lines and the name no longer
 * truncated; the previous glass card was a fixed 300px tall and cut both off.
 * Same testimonials endpoint as before.
 */
const Testimonials = ({ className }) => {
  const { t } = useTranslation();
  const { ref, revealClass, style } = useReveal();
  const { data, loading } = useGetData(API.testimonials);

  if (!loading && data?.length === 0) return null;

  return (
    <section ref={ref} style={style} className={`testimonials_ds ${revealClass} ${className ?? ""}`}>
      <header className="testimonials_ds_header">
        <h2 className="testimonials_ds_headline">{t("testimonials")}</h2>
      </header>

      <div className="testimonials_ds_grid">
        {loading
          ? Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="testimonials_ds_card">
                <Skeleton height="88px" />
                <div className="testimonials_ds_person">
                  <Skeleton shape="circle" size="44px" />
                  <Skeleton width="120px" height="16px" />
                </div>
              </div>
            ))
          : data?.map((item) => (
              <figure key={item?.id} className="testimonials_ds_card">
                <blockquote className="testimonials_ds_quote">
                  {item?.content}
                </blockquote>
                <figcaption className="testimonials_ds_person">
                  {item?.user?.avatar ? (
                    <img
                      loading="lazy"
                      decoding="async"
                      src={getImageUrl(item.user.avatar, { width: IMG.avatar })}
                      alt={item?.user?.full_name || ""}
                      className="testimonials_ds_avatar"
                    />
                  ) : (
                    // Initials rather than a blank disc: it identifies the
                    // reviewer instead of reading as a failed image.
                    <span
                      className="testimonials_ds_avatar is_empty"
                      aria-hidden="true"
                    >
                      {initialsOf(item?.user?.full_name)}
                    </span>
                  )}
                  <span className="testimonials_ds_person_text">
                    <strong>{item?.user?.full_name}</strong>
                    {item?.user?.role && <span>{item.user.role}</span>}
                  </span>
                </figcaption>
              </figure>
            ))}
      </div>
    </section>
  );
};

export default Testimonials;
