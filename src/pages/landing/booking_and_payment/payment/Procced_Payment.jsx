import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import Right_Text_Header from "../../../../components/layout/header/Right_Text_Header";
import Landing_Header from "../../../../components/layout/header/Landing_Header";

const paymentURL = import.meta.env.VITE_REACT_APP_PAYMENT || "https://eu-prod.oppwa.com/v1/paymentWidgets.js";
const Procced_Payment = () => {
  const { id: checkoutId } = useParams();
  const shopperResultUrl = `${window.location.origin}/payment/result`;

  useEffect(() => {
    if (!checkoutId) return;
    const script = document.createElement("script");
    script.src = `${paymentURL}?checkoutId=${checkoutId}`;
    script.async = true;
    script.crossOrigin = "anonymous";
    document.body.appendChild(script);

    const optionsScript = document.createElement("script");
    optionsScript.type = "text/javascript";
    optionsScript.text = `var wpwlOptions = { paymentTarget: "_top" };`;
    document.body.appendChild(optionsScript);

    // return () => {
    //   document.body.removeChild(script);
    //   document.body.removeChild(script);
    //   document.body.removeChild(optionsScript);
    // };
  }, [checkoutId]);
  return (
    <section className="flex flex-col gap-10 md:gap-16  pb-[149px]">
      <Landing_Header title="payment" src="sm" />
      <div className="secondary_border w-fit form_p mx-auto">
        <form
          action={shopperResultUrl}
          className="paymentWidgets "
          data-brands="MADA VISA MASTER"
        ></form>
      </div>
    </section>
  );
};

export default Procced_Payment;
