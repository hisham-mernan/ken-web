import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "./footer/Footer";
import Navbar from "./navbar/Navbar";

const App_Layout = () => {
  return (
    <main className="overflow-x-hidden min-h-screen flex flex-col justify-between">
      <div className="overflow-hidden relative">
        <Navbar />
        <Outlet />
      </div>
      <div>
        <Footer />
      </div>
    </main>
  );
};

export default App_Layout;
