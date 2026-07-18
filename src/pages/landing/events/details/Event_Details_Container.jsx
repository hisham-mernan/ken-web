import React from "react";
import Testimonials from "../../../../components/shared/testimonials/Testimonials";
import Connect_With_Ken from "../../../../components/shared/Connect_With_Ken";
import Services from "../../../../components/shared/services/Services";
import Event_Details from "./Event_Details";

const Event_Details_Container = () => {
  return (
    <section className="page_p flex flex-col gap-20 layout_bg">
      <Event_Details />
      <Services />
      <Testimonials />
      <Connect_With_Ken />
    </section>
  );
};

export default Event_Details_Container;
