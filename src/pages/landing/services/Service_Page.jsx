import React from "react";
import Testimonials from "../../../components/shared/testimonials/Testimonials";
import Connect_With_Ken from "../../../components/shared/Connect_With_Ken";
import { SHOW_CONNECT_BANNER } from "../../../config/features";

import Services from "../../../components/shared/services/Services";
import Service_Category from "./Service_Category";

import Landing_Header from "../../../components/layout/header/Landing_Header";

const Service_Page = () => {
  return (
    <main className="page_p flex flex-col ">
      <section className="grid gap-8 sm:gap-20 section_p_b">
        <Services />
        <Service_Category />
      </section>
      <Testimonials className="section_p_b" />
      {SHOW_CONNECT_BANNER && <Connect_With_Ken />}
    </main>
  );
};

export default Service_Page;
