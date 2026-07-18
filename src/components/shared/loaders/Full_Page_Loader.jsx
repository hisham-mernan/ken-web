import React from "react";

const Full_Page_Loader = () => {
  return (
    <section className="h-dvh flex_center bg-white z-[1000]  w-full fixed inset-0">
      <div className="loader flex items-center gap-2">
        <div></div>
        <div></div>
        <div></div>
      </div>
    </section>
  );
};

export default Full_Page_Loader;
