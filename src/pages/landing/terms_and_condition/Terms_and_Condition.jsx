import React from "react";
import Special_Landing_Header from "../../../components/layout/header/Special_Landing_Header";
import Connect_With_Ken from "../../../components/shared/Connect_With_Ken";
import { SHOW_CONNECT_BANNER } from "../../../config/features";
import Terms_Data from "./Terms_Data";
import Landing_Header from "../../../components/layout/header/Landing_Header";

const Terms_and_Condition = () => {
  return (
    <section className="layout_bg page_p flex flex-col gap-8 md:gap-10 lg:gap-16 xl:gap-[107px] ">
      <Landing_Header title="terms_and_conditions" src="2xl" />
      <Terms_Data />
      {SHOW_CONNECT_BANNER && <Connect_With_Ken />}
    </section>
  );
};

export default Terms_and_Condition;
