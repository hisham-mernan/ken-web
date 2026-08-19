import React from "react";
import { useTranslation } from "react-i18next";

/**
 * Inner-page hero, per the Ken design system's PageShell: a short image band
 * (58vh) under a scrim, with a small caps eyebrow above a display title,
 * bottom-aligned and centred. Shared so About and Huts open the same way.
 */
const Page_Hero = ({ image, eyebrow, title }) => {
  const { t } = useTranslation();
  return (
    <section
      className="page_hero"
      style={
        image
          ? {
              backgroundImage: `linear-gradient(180deg, rgba(28,20,13,.45) 0%, rgba(28,20,13,.25) 45%, rgba(28,20,13,.72) 100%), url('${image}')`,
            }
          : undefined
      }
    >
      {eyebrow && <span className="page_hero_eyebrow">{t(eyebrow)}</span>}
      <h1 className="page_hero_title">{title}</h1>
    </section>
  );
};

export default Page_Hero;
