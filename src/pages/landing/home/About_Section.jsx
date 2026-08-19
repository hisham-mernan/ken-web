import React from "react";
import { useTranslation } from "react-i18next";
import { Skeleton } from "primereact/skeleton";

import useGetData from "../../../hooks/useGetData";
import { API } from "../../../service/apiUrl";
import { currentLanguageCode } from "../../../utils/switchLang";
import { getImageUrl, IMG } from "../../../utils/getImageUrl";

/**
 * About, as the Ken design system lays it out: an editorial split for the
 * mission, then a full-bleed walnut band for the vision. Replaces the two-slide
 * swiper of hover cards, where both statements were hidden until moused over.
 *
 * Text and images are the same about-section API the swiper used -- mission,
 * mission_image, vission, vision_image, with the _ar variants under Arabic.
 * Headings reuse the existing about_us / our_mission / our_vision keys.
 */
const About_Section = () => {
  const { t } = useTranslation();
  const { data, loading } = useGetData(API.about_section);
  const about = data?.at(0);
  const isEn = currentLanguageCode === "en";

  if (loading) return <About_Section_Skeleton />;
  if (!about) return null;

  const mission = isEn ? about?.mission : about?.mission_ar;
  const vision = isEn ? about?.vission : about?.vission_ar;

  return (
    <section className="about_ds">
      {/* Mission: editorial split, image anchored by a smaller overlapping one */}
      <div className="about_ds_split">
        <div className="about_ds_copy">
          <span className="about_ds_eyebrow">{t("about_us")}</span>
          <h2 className="about_ds_headline">{t("our_mission")}</h2>
          <span className="about_ds_rule" />
          {mission && <p className="about_ds_body">{mission}</p>}
        </div>

        <div className="about_ds_media">
          {about?.mission_image && (
            <img
              loading="lazy"
              decoding="async"
              src={getImageUrl(about.mission_image, { width: IMG.card })}
              alt={t("our_mission")}
              className="about_ds_media_main"
            />
          )}
          {about?.vision_image && (
            <img
              loading="lazy"
              decoding="async"
              src={getImageUrl(about.vision_image, { width: IMG.card })}
              alt={t("our_vision")}
              className="about_ds_media_inset"
            />
          )}
        </div>
      </div>

      {/* Vision: full-bleed walnut band, the system's dark surface */}
      {vision && (
        <div className="about_ds_band">
          <div className="about_ds_band_inner">
            {about?.vision_image && (
              <img
                loading="lazy"
                decoding="async"
                src={getImageUrl(about.vision_image, { width: IMG.card })}
                alt={t("our_vision")}
                className="about_ds_band_media"
              />
            )}
            <div className="about_ds_band_copy">
              <span className="about_ds_band_eyebrow">{t("our_vision")}</span>
              <p className="about_ds_band_text">{vision}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

const About_Section_Skeleton = () => (
  <section className="about_ds">
    <div className="about_ds_split">
      <div className="about_ds_copy">
        <Skeleton width="30%" height="14px" />
        <Skeleton width="70%" height="48px" />
        <Skeleton width="100%" height="80px" />
      </div>
      <Skeleton width="100%" height="560px" borderRadius="20px" />
    </div>
  </section>
);

export default About_Section;
