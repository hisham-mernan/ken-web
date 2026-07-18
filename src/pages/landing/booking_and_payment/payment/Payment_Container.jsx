import React from "react";
import { Outlet } from "react-router-dom";

const Payment_Container = () => {
  return (
    <div className="layout_bg Container page_p">
      <Outlet />
    </div>
  );
};

export default Payment_Container;
