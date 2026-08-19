import React from "react";
import { SHOW_CONTACT_FORM } from "../../../config/features";
import Support from "../../../components/shared/support/Support";
import Special_Landing_Header from "../../../components/layout/header/Special_Landing_Header";
import Booking_Contact from "./components/Booking_Contact";

const Contact_us = () => {
  return (
    <section className="layout_bg page_p  flex flex-col gap-5 md:gap-10 xl:gap-20">
      <Special_Landing_Header
        title="my"
        italicTitle="booking_title"
        className="!py-4 !h-fit"
      />
      <section className="Container flex flex-col gap-5 md:gap-10 xl:gap-20">
        <Booking_Contact />
      </section>
      {SHOW_CONTACT_FORM && <Support />}
    </section>
  );
};

export default Contact_us;
