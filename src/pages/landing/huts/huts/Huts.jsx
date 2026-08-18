import React, { useRef } from "react";
import Events from "../../../../components/shared/events/Events";
import Services from "../../../../components/shared/services/Services";
import Testimonials from "../../../../components/shared/testimonials/Testimonials";

import Huts_Hero from "./components/Huts_Hero";
import Available_Huts from "./components/Available_Huts";
import Support from "../../../../components/shared/support/Support";
import { SHOW_EVENTS, SHOW_SERVICES } from "../../../../config/features";

const Huts = () => {
  const nextStepRef = useRef(null);
  return (
    <main className="layout_bg   page_p ">
      <Huts_Hero scrollToRef={nextStepRef} />
      <Available_Huts ref={nextStepRef} />
      {SHOW_EVENTS && <Events />}
      {SHOW_SERVICES && <Services />}
      <Testimonials />
      <Support />
    </main>
  );
};

export default Huts;
