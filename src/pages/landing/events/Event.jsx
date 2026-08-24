import React from "react";
import Special_Landing_Header from "../../../components/layout/header/Special_Landing_Header";
import Services from "../../../components/shared/services/Services";
import Testimonials from "../../../components/shared/testimonials/Testimonials";
import Connect_With_Ken from "../../../components/shared/Connect_With_Ken";
import { SHOW_CONNECT_BANNER } from "../../../config/features";
import All_Events from "./All_Events";

const Event = () => {
  return (
    <main className="page_p flex flex-col ">
      <section className="grid gap-8 sm:gap-20">
        <All_Events />
      </section>
      <Services />
      <Testimonials />
      {SHOW_CONNECT_BANNER && <Connect_With_Ken />}
    </main>
  );
};

export default Event;
