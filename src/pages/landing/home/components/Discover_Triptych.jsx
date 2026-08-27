import React, { useState } from "react";
import useReveal from "../../../../hooks/useReveal";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "primereact/skeleton";

import Button from "../../../../components/shared/Button";
import Hut_Rates from "../../../../components/shared/Hut_Rates";
import { getImageUrl } from "../../../../utils/getImageUrl";

/**
 * Discover, as the Ken design system lays it out: three full-height panels that
 * expand on hover rather than a carousel of cards. Replaces the swiper because
 * the huts are the product -- they earn full-bleed photography, not thumbnails.
 *
 * Every value on screen comes from the huts API. Nothing here is placeholder
 * copy: titles, descriptions, ratings, capacity, size and price are whatever
 * the dashboard holds, in whichever language is active.
 */
const Discover_Triptych = ({ data, loading }) => {
  const { t, i18n } = useTranslation();
  const { ref, revealClass, style } = useReveal();
  const navigate = useNavigate();
  const isRtl = i18n?.language === "ar";
  // The first panel opens by default so the section never reads as flat.
  const [active, setActive] = useState(0);

  // Three panels is the layout's premise; more would each be a sliver.
  const huts = (data || []).slice(0, 3);

  if (loading) {
    return (
      <section className="discover_triptych_section">
        <Discover_Header />
        <div className="discover_triptych">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} height="100%" borderRadius="0" />
          ))}
        </div>
      </section>
    );
  }

  if (!huts.length) return null;

  return (
    <section
      ref={ref}
      style={style}
      className={`discover_triptych_section ${revealClass}`}
    >
      <Discover_Header />
      <div className="discover_triptych">
        {huts.map((hut, index) => {
          const open = active === index;
          const title = (isRtl && hut?.title_ar) || hut?.title || "";
          const description =
            (isRtl && hut?.description_ar) || hut?.description || "";
          const image = getImageUrl(hut?.main_image);
          // The whole overnight capacity, children included -- adding the
          // child allowance on top advertised twice the beds.
          const guests = hut?.max_persons_num
            ? `${hut.max_persons_num}`
            : null;

          return (
            <article
              key={hut?.id}
              className={`discover_panel ${open ? "is_open" : ""}`}
              style={{
                backgroundImage: `linear-gradient(180deg, rgba(28,20,13,${
                  open ? 0.05 : 0.35
                }) 30%, rgba(28,20,13,.78) 100%)${
                  image ? `, url('${image}')` : ""
                }`,
              }}
              onMouseEnter={() => setActive(index)}
              onFocus={() => setActive(index)}
              onClick={() => setActive(index)}
              tabIndex={0}
            >
              <div className="discover_panel_body">
                <span className="discover_panel_index">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="discover_panel_title">{title}</h3>

                <div className="discover_panel_reveal">
                  {description && (
                    <p className="discover_panel_desc">{description}</p>
                  )}
                  <div className="discover_panel_meta">
                    {hut?.rate ? <span>★ {hut.rate}</span> : null}
                    {guests ? <span>{`${guests} ${t("person")}`}</span> : null}
                  </div>
                  <div className="discover_panel_actions">
                    <Hut_Rates hut={hut} tone="light" />
                    <Button
                      type="light"
                      size="md"
                      rounded="full"
                      hasFullWidth={false}
                      className="!w-fit !px-6"
                      onClick={(event) => {
                        event.stopPropagation();
                        navigate(`/huts/${hut?.id}/details`);
                      }}
                    >
                      {t("book_now")}
                    </Button>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

/**
 * The system opens sections with an eyebrow above a display headline. The site
 * only has one string for this section, so it is used once, as the headline --
 * repeating it as an eyebrow would be inventing copy.
 */
const Discover_Header = () => {
  const { t } = useTranslation();
  return (
    <header className="discover_triptych_header">
      <h2 className="discover_headline">{t("discover")}</h2>
    </header>
  );
};

export default Discover_Triptych;
