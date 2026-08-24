import React from "react";
import Testimonials from "../../../../components/shared/testimonials/Testimonials";
import Connect_With_Ken from "../../../../components/shared/Connect_With_Ken";
import { SHOW_CONNECT_BANNER } from "../../../../config/features";
import Services from "../../../../components/shared/services/Services";
import Event_Details from "./Event_Details";

const Event_Details_Container = () => {
  return (
    <section className="page_p flex flex-col gap-20 layout_bg">
      <Event_Details />
      <Services />
      <Testimonials />
      {SHOW_CONNECT_BANNER && <Connect_With_Ken />}
    </section>
  );
};

export default Event_Details_Container;
