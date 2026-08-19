import React from "react";
import { useTranslation } from "react-i18next";

import Connect_With_Ken from "../../../components/shared/Connect_With_Ken";
import Testimonials from "../../../components/shared/testimonials/Testimonials";
import About_Section from "../home/About_Section";
import Special_About_Us from "./Special_About_Us";
import Our_Services from "./our_services/Our_Services";
import Our_Story from "./our_story/Our_Story";
import Page_Hero from "../../../components/layout/header/Page_Hero";
import { AboutHero1 } from "../../../assets/images/Image";

/**
 * About, per the Ken design system: the same short image hero the Huts page
 * opens with, then the mission split and walnut vision band.
 *
 * The reference's "Why Ken" grid is not reproduced -- its three values were
 * placeholder copy. The site's own Special_About_Us and Our_Services sections
 * carry that role with real content.
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
      <Our_Story />
      <About_Section />
      <Special_About_Us />
      <Our_Services />
      <Testimonials />
      <Connect_With_Ken />
    </main>
  );
};

export default About;
