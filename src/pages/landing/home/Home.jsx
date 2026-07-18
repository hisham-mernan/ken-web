import React, { useEffect, useRef } from "react";
import Connect_With_Ken from "../../../components/shared/Connect_With_Ken";
import Faq from "./Faq";
import Services from "../../../components/shared/services/Services";
import Events from "../../../components/shared/events/Events";
import Testimonials from "../../../components/shared/testimonials/Testimonials";

import Home_Hero from "./Home_Hero";
import About_Section from "./About_Section";
import Discover from "./Discover";
import Service_Pitch from "./Service_Pitch";
import Offer_Banner from "./Offer_Banner";

const Home = () => {
  return (
    <main className="layout_bg flex flex-col ">
      <Home_Hero />
      <About_Section />
      <Offer_Banner />
      <Discover />
      <Events />
      <Services />
      <Testimonials />
      <Faq />
      <Service_Pitch />
      <Connect_With_Ken />
    </main>
  );
};

export default Home;
