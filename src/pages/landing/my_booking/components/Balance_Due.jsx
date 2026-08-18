import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import Button from "../../../../components/shared/Button";
import axiosInstance from "../../../../service/axiosInstance";
import { API } from "../../../../service/apiUrl";
import { handleErrors } from "../../../../utils/handleError";

// Shown when a deposit was taken: the dates are held but no entry QR exists
// until the balance clears, so the booking needs a way to settle it from here
// rather than only through the reminder email.
const Balance_Due = ({ id, paid, notPaid, totalPrice }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const payBalance = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.post(API.payment.checkout, {
        booking_id: id,
      });
      if (response.status === 201) {
        navigate(`/payment/${response?.data?.checkout_id}`);
      }
    } catch (err) {
      handleErrors(err, null, t);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="secondary_border flex flex-col gap-5 p-5 sm:p-8">
      <h3 className="text-secondary text-lg sm:text-xl font-bold">
        {t("balance_due")}
      </h3>
      <p className="text-[#808080] text-sm sm:text-base">
        {t("deposit_qr_pending")}
      </p>
      <div className="flex flex-col xs:flex-row xs:items-center gap-3 xs:gap-8">
        <span className="text-primary-3 text-sm sm:text-base">
          {`${t("total_price")}: ${totalPrice} ${t("sar")}`}
        </span>
        <span className="text-primary-3 text-sm sm:text-base">
          {`${t("paid")}: ${paid} ${t("sar")}`}
        </span>
        <span className="text-secondary text-sm sm:text-base font-bold">
          {`${t("balance_due")}: ${notPaid} ${t("sar")}`}
        </span>
      </div>
      <Button
        rounded="full"
        className="max-w-full sm:max-w-[400px]"
        loading={loading}
        disabled={loading}
        onClick={payBalance}
      >
        {`${t("pay_balance")} (${notPaid} ${t("sar")})`}
      </Button>
    </section>
  );
};

export default Balance_Due;
