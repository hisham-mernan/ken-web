import React from "react";
import Connect_With_Ken from "../../../components/shared/Connect_With_Ken";
import Testimonials from "../../../components/shared/testimonials/Testimonials";
import About_Section from "../home/About_Section";
import Special_About_Us from "./Special_About_Us";
import Our_Services from "./our_services/Our_Services";
import About_Hero from "./About_Hero";
import Our_Story from "./our_story/Our_Story";

const About = () => {
  return (
    <main className="layout_bg flex flex-col page_p ">
      <About_Hero />
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
