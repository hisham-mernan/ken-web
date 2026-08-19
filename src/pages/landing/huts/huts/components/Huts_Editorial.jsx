import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "primereact/skeleton";

import Button from "../../../../../components/shared/Button";
import { getImageUrl, IMG } from "../../../../../utils/getImageUrl";

/**
 * The huts in editorial detail, per the design system's huts page: full-height
 * photography alternating side to side, each paired with a large index numeral,
 * the hut's name in the display face, its stats, a rule, the description and
 * the price beside a book action.
 *
 * Replaces the grid of small cards. Everything shown comes from the huts
 * endpoint; the reference's amenity checklist is deliberately absent because
 * that endpoint carries no amenities and inventing them would be fiction.
 */
const Huts_Editorial = ({ data, loading }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isRtl = i18n?.language === "ar";

  if (loading) {
    return (
      <section className="huts_editorial">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="huts_editorial_row">
            <Skeleton height="600px" borderRadius="20px" />
            <div className="huts_editorial_copy">
              <Skeleton width="80px" height="72px" />
              <Skeleton width="60%" height="40px" />
              <Skeleton width="100%" height="90px" />
            </div>
          </div>
        ))}
      </section>
    );
  }

  if (!data?.length) return null;

  return (
    <section className="huts_editorial">
      {data.map((hut, index) => {
        const title = (isRtl && hut?.title_ar) || hut?.title || "";
        const description =
          (isRtl && hut?.description_ar) || hut?.description || "";
        const guests =
          hut?.max_persons_num || hut?.max_kids_num
            ? `${Math.min(hut.max_persons_num, hut.max_kids_num)} - ${
                (hut.max_persons_num || 0) + (hut.max_kids_num || 0)
              } ${t("person")}`
            : null;

        return (
          <article
            key={hut?.id}
            // Rows alternate so the eye zig-zags down the page instead of
            // running straight along one column of images.
            className={`huts_editorial_row ${index % 2 ? "is_flipped" : ""}`}
          >
            <img
              loading="lazy"
              decoding="async"
              src={getImageUrl(hut?.main_image, { width: IMG.card })}
              alt={title}
              className="huts_editorial_media"
            />

            <div className="huts_editorial_copy">
              <span className="huts_editorial_index">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h2 className="huts_editorial_title">{title}</h2>

              <div className="huts_editorial_meta">
                {hut?.rate ? <span>★ {hut.rate}</span> : null}
                {guests ? <span>{guests}</span> : null}
                {hut?.size ? <span>{hut.size}</span> : null}
                {hut?.total_reviews ? (
                  <span>{`${hut.total_reviews} ${t("reviews")}`}</span>
                ) : null}
              </div>

              <span className="huts_editorial_rule" />

              {description && (
                <p className="huts_editorial_desc">{description}</p>
              )}

              <div className="huts_editorial_actions">
                {hut?.lowest_price > 0 && (
                  <span className="huts_editorial_price">
                    {hut.lowest_price} {t("sar")}
                    <span> / {t("per_night")}</span>
                  </span>
                )}
                <Button
                  type="primary"
                  size="md"
                  rounded="full"
                  hasFullWidth={false}
                  className="!w-fit !px-7"
                  onClick={() => navigate(`/huts/${hut?.id}/details`)}
                >
                  {t("book_now")}
                </Button>
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
};

export default Huts_Editorial;
