import React from "react";
import { useTranslation } from "react-i18next";

import Button from "../../../components/shared/Button";

/**
 * The hero as the Ken design system lays it out: full-bleed photography under a
 * scrim, a display headline, and a scroll cue.
 *
 * The headline and subhead were already in the locale files (`home_hero`,
 * `hero_des`) but were being shipped as a flattened PNG of the text. Setting
 * them as real type means they translate, scale, and are readable by search
 * engines -- and the display face can actually do its job. No new copy: every
 * string here already existed.
 */
const Home_Hero = () => {
  const { t } = useTranslation();

  // Takes the reader to whatever section follows the hero, rather than a
  // hard-coded offset that would drift if the page order changed.
  const scrollToNext = () => {
    const hero = document.querySelector(".home_hero");
    const next = hero?.nextElementSibling;
    if (next) {
      next.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
    }
  };

  // The stored headline carries a literal "</br>" as its line break.
  const headlineLines = String(t("home_hero"))
    .split(/<\/?br\s*\/?>/i)
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <section className="home_hero">
      <div className="home_hero_body">
        <h1 className="home_hero_title">
          {headlineLines.map((line, index) => (
            <React.Fragment key={line}>
              {index > 0 && <br />}
              {line}
            </React.Fragment>
          ))}
        </h1>
        <p className="home_hero_desc">{t("hero_des")}</p>
        <div className="home_hero_actions">
          <Button type="light" size="lg" hasFullWidth={false} to="/huts">
            {t("book_now")}
          </Button>
        </div>
      </div>

      {/* A button, not a decorative span: it says "Scroll Down", so it should
          scroll down when clicked -- and be reachable by keyboard. */}
      <button type="button" className="home_hero_scroll" onClick={scrollToNext}>
        {t("scroll_down")}
        <span className="home_hero_scroll_line" aria-hidden="true" />
      </button>
    </section>
  );
};

export default Home_Hero;
