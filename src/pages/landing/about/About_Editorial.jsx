import React from "react";
import { useTranslation } from "react-i18next";
import { Skeleton } from "primereact/skeleton";

import useGetData from "../../../hooks/useGetData";
import { API } from "../../../service/apiUrl";
import { currentLanguageCode } from "../../../utils/switchLang";
import { getImageUrl, IMG } from "../../../utils/getImageUrl";

// Mirrors Service.jsx's fallback so the two sections cannot drift apart when
// the services endpoint is empty.
const DEFAULT_SERVICES = [
  {
    id: 1,
    title: "Build",
    title_ar: "بناء وتشييد",
    description:
      "Natural wood structures and authentic eco-huts built by Saudi hands in scenic locations.",
    description_ar:
      "أكواخ ومباني خشبية طبيعية فاخرة تم بناؤها بأيدي سعودية في مواقع طبيعية ساحرة.",
  },
  {
    id: 2,
    title: "Modern Spaces",
    title_ar: "مساحة حديثة",
    description:
      "Luxurious modern interior spaces tailored with high-grade natural timber and smart amenities.",
    description_ar:
      "تصميم مساحات حديثة وعصرية مجهزة بلمسات الخشب الطبيعي وأرقى مستويات الراحة.",
  },
  {
    id: 3,
    title: "Operation & Services",
    title_ar: "إدارة وتشغيل",
    description:
      "Full-service resort operation, housekeeping, private dining, wellness, and eco-retreat management.",
    description_ar:
      "خدمات تشغيل وإدارة كاملة للمنتجعات والأكواخ مع الضيافة الفاخرة والصيانة المستمرة.",
  },
];

/**
 * About, laid out exactly as the design system's about.html: an editorial
 * split for the story, a walnut band carrying mission and vision side by side
 * under hairline rules, then a numbered three-column grid.
 *
 * The reference's own copy is placeholder and is not used. Every string and
 * image here is the site's: the story endpoint, the about-us endpoint, and the
 * three services the site already describes.
 */
const About_Editorial = () => {
  const { t } = useTranslation();
  const isEn = currentLanguageCode === "en";

  const { data: storyData, loading: storyLoading } = useGetData(
    API.about.story
  );
  const { data: aboutData, loading: aboutLoading } = useGetData(
    API.about_section
  );
  const { data: serviceData } = useGetData(API.about.our_service);
  const services =
    serviceData?.length >= 3 ? serviceData.slice(0, 3) : DEFAULT_SERVICES;

  const story = storyData?.at(0);
  const secondStory = storyData?.at(1);
  const about = aboutData?.at(0);

  const mission = isEn ? about?.mission : about?.mission_ar;
  const vision = isEn ? about?.vission : about?.vission_ar;

  return (
    <>
      {/* ---- Our Story: editorial split with an offset inset image ---- */}
      {storyLoading ? (
        <section className="about_split">
          <div className="about_split_copy">
            <Skeleton width="30%" height="14px" />
            <Skeleton width="80%" height="56px" />
            <Skeleton width="100%" height="90px" />
          </div>
          <Skeleton width="100%" height="560px" borderRadius="20px" />
        </section>
      ) : story ? (
        <section className="about_split">
          <div className="about_split_copy">
            <span className="about_eyebrow">{t("ken_story")}</span>
            <h2 className="about_split_headline">
              {isEn ? story?.title : story?.title_ar}
            </h2>
            <span className="about_rule" />
            <p className="about_split_body">
              {isEn ? story?.description : story?.description_ar}
            </p>
          </div>

          <div className="about_split_media">
            {story?.image && (
              <img
                loading="lazy"
                decoding="async"
                src={getImageUrl(story.image, { width: IMG.card })}
                alt={isEn ? story?.title : story?.title_ar}
                className="about_split_media_main"
              />
            )}
            {secondStory?.image && (
              <img
                loading="lazy"
                decoding="async"
                src={getImageUrl(secondStory.image, { width: IMG.card })}
                alt={isEn ? secondStory?.title : secondStory?.title_ar}
                className="about_split_media_inset"
              />
            )}
          </div>
        </section>
      ) : null}

      {/* ---- Mission and vision, side by side on the walnut surface ---- */}
      {!aboutLoading && (mission || vision) && (
        <section className="about_band">
          <div className="about_band_inner">
            {mission && (
              <div className="about_band_col">
                <span className="about_band_eyebrow">{t("our_mission")}</span>
                <p className="about_band_text">{mission}</p>
              </div>
            )}
            {vision && (
              <div className="about_band_col">
                <span className="about_band_eyebrow">{t("our_vision")}</span>
                <p className="about_band_text">{vision}</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ---- Why Ken: numbered three-column grid ---- */}
      <section className="about_why">
        <header className="about_why_header">
          <span className="about_eyebrow">{t("our_services")}</span>
          <h2 className="about_why_headline">{t("home_hero_plain")}</h2>
        </header>
        <div className="about_why_grid">
          {services.map((item, index) => (
            <article key={item?.id ?? index} className="about_why_col">
              <span className="about_why_index">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="about_why_title">
                {isEn ? item?.title : item?.title_ar}
              </h3>
              <p className="about_why_body">
                {isEn ? item?.description : item?.description_ar}
              </p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
};

export default About_Editorial;
