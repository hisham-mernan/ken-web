import React from "react";
import Connect_With_Ken from "../../../components/shared/Connect_With_Ken";
import Faq from "./Faq";
import Services from "../../../components/shared/services/Services";
import Events from "../../../components/shared/events/Events";
import Testimonials from "../../../components/shared/testimonials/Testimonials";

import Home_Hero from "./Home_Hero";
import About_Section from "./About_Section";
import Discover from "./Discover";

import useGetData from "../../../hooks/useGetData";
import { API } from "../../../service/apiUrl";
import {
  SHOW_EVENTS,
  SHOW_SERVICES,
  SHOW_CONNECT_BANNER,
} from "../../../config/features";

const Home = () => {
  // Pre-fetch consolidated homepage data in 1 single HTTP network request
  useGetData(API.home.combined);

  return (
    <main className="layout_bg flex flex-col ">
      <Home_Hero />
      <About_Section />
      <Discover />
      {SHOW_EVENTS && <Events />}
      {SHOW_SERVICES && <Services />}
      <Testimonials />
      <Faq />
      {SHOW_CONNECT_BANNER && <Connect_With_Ken />}
    </main>
  );
};

export default Home;
