import React from "react";
import {
  OurServiceVector1,
  OurServiceVector2,
} from "../../../../assets/images/Image";

import Service from "./Service";
import Our_Partener from "./Our_Partener";

const Our_Services = () => {
  return (
    <section className=" bg-main relative py-16 xl:pt-[108px] xl:pb-[150px]">
      <img
        src={OurServiceVector1}
        className="absolute top-0 left-0 w-[250px]"
      />
      <div className="Container relative z-10 flex flex-col gap-20 ">
        <Service />
      </div>
      <img
        src={OurServiceVector2}
        className="absolute bottom-0 right-0 w-[250px]"
      />
    </section>
  );
};

export default Our_Services;
