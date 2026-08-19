import React from "react";
import { useTranslation } from "react-i18next";

import Testimonials from "../../../../components/shared/testimonials/Testimonials";
import Events from "../../../../components/shared/events/Events";
import Services from "../../../../components/shared/services/Services";
import Support from "../../../../components/shared/support/Support";
import Page_Hero from "../../../../components/layout/header/Page_Hero";
import Huts_Editorial from "./components/Huts_Editorial";

import useGetData from "../../../../hooks/useGetData";
import { API } from "../../../../service/apiUrl";
import { HutsHero3 } from "../../../../assets/images/Image";
import { SHOW_EVENTS, SHOW_SERVICES, SHOW_CONTACT_FORM } from "../../../../config/features";

/**
 * Huts, per the Ken design system: a short image hero, then each hut in
 * editorial detail rather than a grid of cards.
 *
 * Copy is the site's own -- "Each new place has a Story" already existed in
 * the locale files, and is the same line the reference page uses.
 */
const Huts = () => {
  const { t } = useTranslation();
  const { data, loading } = useGetData(API.huts.all_huts);
  const rows = Array.isArray(data) ? data : data?.results ?? [];

  return (
    <main className="layout_bg">
      <Page_Hero
        image={HutsHero3}
        eyebrow="huts"
        title={`${t("each_new_place")} ${t("story")}`}
      />
      <Huts_Editorial data={rows} loading={loading} />
      {SHOW_EVENTS && <Events />}
      {SHOW_SERVICES && <Services />}
      <Testimonials />
      {SHOW_CONTACT_FORM && <Support />}
    </main>
  );
};

export default Huts;
