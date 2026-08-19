import React from "react";
import { useTranslation } from "react-i18next";

import Connect_With_Ken from "../../../components/shared/Connect_With_Ken";
import Testimonials from "../../../components/shared/testimonials/Testimonials";
import About_Editorial from "./About_Editorial";
import Page_Hero from "../../../components/layout/header/Page_Hero";
import { AboutHero1 } from "../../../assets/images/Image";

/**
 * About, per the Ken design system: the same short image hero the Huts page
 * opens with, then the mission split and walnut vision band.
 *
 * The whole page body lives in About_Editorial, which follows the kit's
 * about.html section for section.
 */
const About = () => {
  const { t } = useTranslation();
  return (
    <main className="layout_bg flex flex-col">
      <Page_Hero
        image={AboutHero1}
        eyebrow="about_us"
        title={`${t("each_new_place")} ${t("story")}`}
      />
      <About_Editorial />
      <Testimonials />
      <Connect_With_Ken />
    </main>
  );
};

export default About;
