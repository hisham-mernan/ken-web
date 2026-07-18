import React from "react";
import { LogoLetter, LogoLg, LogoLgLeft } from "../../assets/images/Image";

const Branded_Section = ({
  children,
  className = "",
  logoLeftClassName = "",
}) => {
  return (
    <section
      className={`w-full bg-main py-20  sm:py-28 lg:py-[130px]  relative max-w-[1536px] mx-auto ${className} `}
    >
      <img
        src={LogoLg}
        className={`${logoLeftClassName} absolute top-0 left-0 w-[50px] sm:w-[80px] md:w-[100px] lg:w-[180px] xl:w-[200px]`}
      />
      <img
        src={LogoLetter}
        className="absolute top-[12%] right-[4%] md:right-[10%] w-[40px] sm:w-[50px] md:w-[80px] "
        alt="vector"
      />
      <div className="relative z-10">{children}</div>
      <img
        src={LogoLgLeft}
        className="absolute bottom-9 right-0 w-[100px] sm:w-[120px] md:w-[180px] lg:w-[250px] xl:w-[400px]"
      />
    </section>
  );
};

export default Branded_Section;
