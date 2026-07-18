import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { BrowserRouter } from "react-router-dom";
// tailwind
import "./assets/style/config/tailwind_config.css";

// lang
import "./I18next.js";
// start toastify
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// prime
import { PrimeReactProvider } from "primereact/api";
import "primereact/resources/themes/tailwind-light/theme.css";

// slick
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import "leaflet/dist/leaflet.css";

// style
import "./assets/style/global/style.css";

import App from "./App.jsx";
import { AuthProvider } from "./context/Auth_Context.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <PrimeReactProvider>
        <App />
      </PrimeReactProvider>
    </AuthProvider>
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      pauseOnHover
      theme="light"
    />
  </BrowserRouter>
);
