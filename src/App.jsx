import Cookies from "js-cookie";
import React, { lazy, Suspense, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { currentLanguageCode, switchLang } from "./utils/switchLang";
import { useAuth } from "./context/Auth_Context";
import { Route, Routes } from "react-router-dom";
import { getUserRole } from "./utils/auth";
import Scroll_To_Top from "./components/layout/Scroll_To_Top";
import Full_Page_Loader from "./components/shared/loaders/Full_Page_Loader";
import Aos from "aos";

// Layouts

const App_Layout = lazy(() => import("./components/layout/App_Layout"));

// auth layout
const Auth_Container = lazy(() => import("./pages/auth/Auth_Container"));
const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));
const Forget_Password = lazy(() => import("./pages/auth/Forget_Password"));
const Reset_Password = lazy(() => import("./pages/auth/Reset_Password"));
const Otp = lazy(() => import("./pages/auth/Otp"));

// landing layout
const Home = lazy(() => import("./pages/landing/home/Home"));
const About = lazy(() => import("./pages/landing/about/About"));
const Services = lazy(() => import("./pages/landing/services/Service_Page"));

// events
const Events = lazy(() => import("./pages/landing/events/Event"));
const Event_Details = lazy(() =>
  import("./pages/landing/events/details/Event_Details_Container")
);
//landing - huts
const Huts_Container = lazy(() => import("./pages/landing/huts/Index"));
const Huts = lazy(() => import("./pages/landing/huts/huts/Huts"));
const Huts_Details = lazy(() =>
  import("./pages/landing/huts/huts_details/Details")
);

// booking and payment
const Confirm_Booking = lazy(() =>
  import("./pages/landing/booking_and_payment/confirm_booking/Confirm_Booking")
);

// landing - my booking
const User_Booking = lazy(() =>
  import("./pages/landing/my_booking/User_Booking")
);
const Contact_Us = lazy(() => import("./pages/landing/my_booking/Contact_us"));

// landing - payment
const Payment_Container = lazy(() =>
  import("./pages/landing/booking_and_payment/payment/Payment_Container")
);
const Payment_Form = lazy(() =>
  import("./pages/landing/booking_and_payment/payment/Payment")
);
const Payment_Results = lazy(() =>
  import("./pages/landing/booking_and_payment/payment/Payment_Results")
);
const Procced_Payment = lazy(() =>
  import("./pages/landing/booking_and_payment/payment/Procced_Payment")
);
// ending huts
const Landing_Profile = lazy(() => import("./pages/landing/profile/Profile"));
// landing - terms and conditions
const Terms_And_Conditions = lazy(() =>
  import("./pages/landing/terms_and_condition/Terms_and_Condition")
);

// 404
const Page_Not_Found = lazy(() =>
  import("./pages/landing/404/Page_Nout_Found")
);
// Languages
const languages = [
  { code: "en", name: "English", country_code: "gb", dir: "ltr" },
  { code: "ar", name: "العربية", country_code: "sa", dir: "rtl" },
];
const { role } = getUserRole();

const App = () => {
  const { t } = useTranslation();
  const { token } = useAuth();

  const currentLanguage = languages.find((l) => l.code === currentLanguageCode);
  // Set page direction and language cookie
  useEffect(() => {
    document.body.dir = currentLanguage?.dir || "ltr";
    Cookies.set("i18next", currentLanguageCode);
  }, [currentLanguage, t]);

  return (
    <Suspense fallback={<Full_Page_Loader />}>
      <Scroll_To_Top />
      <Routes location={location} key={location.pathname}>
        <Route path="account" element={<Auth_Container />}>
          <Route path="supplier" element={<Register />} />
          {(!token || !role || role !== "guest") && (
            <>
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path=":email/verify-account" element={<Otp />} />
              <Route path=":email/otp" element={<Otp />} />
              <Route path="forget-password" element={<Forget_Password />} />
              <Route
                path=":email/reset-password"
                element={<Reset_Password />}
              />
            </>
          )}
        </Route>
        <Route path="/" element={<App_Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="services" element={<Services />} />
          <Route path="event">
            <Route index element={<Events />} />
            <Route path=":id/details" element={<Event_Details />} />
          </Route>

          <Route path="huts" element={<Huts_Container />}>
            <Route index element={<Huts />} />
            <Route path=":id/details" element={<Huts_Details />} />
          </Route>
          <Route
            path="terms-and-conditions"
            element={<Terms_And_Conditions />}
          />

          <Route
            path=":id/:type/confirm-booking"
            element={<Confirm_Booking />}
          />
          {token && (
            <>
              {/* payment */}
              <Route path="payment" element={<Payment_Container />}>
                <Route path=":id" element={<Procced_Payment />} />
                <Route path="result" element={<Payment_Results />} />
              </Route>
              <Route path="my-booking" element={<User_Booking />} />
              <Route path="profile" element={<Landing_Profile />} />{" "}
              <Route path="contact" element={<Contact_Us />} />
            </>
          )}

          <Route path="*" element={<Page_Not_Found text="404_des" />} />
        </Route>

        <Route path="*" element={<Page_Not_Found text="404_des" />} />
      </Routes>
    </Suspense>
  );
};

export default App;
