import { useTranslation } from "react-i18next";
import Landing_Header from "../../../../components/layout/header/Landing_Header";
import useGetData from "../../../../hooks/useGetData";
import { API } from "../../../../service/apiUrl";
import { useNavigate } from "react-router-dom";
import Payment_Booking_Details from "./components/Payment_Booking_Details";
import Payment_Ticket_Card from "./components/Payment_Ticket_Card";
import Button from "../../../../components/shared/Button";
import Full_Page_Loader from "../../../../components/shared/loaders/Full_Page_Loader";
import {
  CardRemoveIcon,
  EmptyWaletTimeIcon,
} from "../../../../assets/icons/Icon";
import { useEffect, useState } from "react";
import { handleErrors } from "../../../../utils/handleError";
import axiosInstance from "../../../../service/axiosInstance";
import { getGuestToken } from "../../../../utils/guestBooking";
import { downloadFile } from "../../../../utils/downloadFile";
import { getImageUrl } from "../../../../utils/getImageUrl";

const Payment_Results = () => {
  const { t } = useTranslation();

  const params = new URLSearchParams(window.location.search);
  const resourcePath = params?.get("resourcePath")?.replace("/payment", "");

  const { data, loading } = useGetData(
    `${API.payment.callback}?resourcePath=${resourcePath}`
  );

  if (loading) {
    return <Full_Page_Loader />;
  }
  return (
    <section className="flex flex-col gap-10 md:gap-16 xl:gap-[118px] pb-[149px]">
      {data?.status === "pending" ? (
        <Pending_Payment />
      ) : data?.status === "success" ? (
        <Success_Payment id={data?.transaction?.booking_id} />
      ) : (
        <Failed_Payment id={data?.transaction?.booking_id} />
      )}
    </section>
  );
};
const Pending_Payment = () => {
  const { t } = useTranslation();

  return (
    <>
      <Landing_Header src="xl" title="pending_payment_title" />
      <div className=" secondary_border px-6 py-10 max-w-[600px] mx-auto flex flex-col gap-4 sm:gap-8 ">
        <header className="flex_center text-center flex-col gap-5">
          <span>
            <EmptyWaletTimeIcon width="40" height="40" />
          </span>
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-[32px] !font-bold text-secondary-1">
            {t("booking_pending")}
          </h2>
          <p className="text-secondary-light text-xs sm:text-sm lg:text-base">
            {t("pending_payment_des")}
          </p>
        </header>
      </div>
    </>
  );
};
const Failed_Payment = ({ id }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const handleRetryPayment = async () => {
    try {
      setLoader(true);
      const guestToken = getGuestToken(id);
      const response = await axiosInstance.post(API.payment.checkout, {
        booking_id: id,
        ...(guestToken ? { access_token: guestToken } : {}),
      });
      if (response.status === 201) {
        navigate(`/payment/${response?.data?.checkout_id}`);
      }
    } catch (err) {
      handleErrors(err, null, t);
    } finally {
      setLoader(false);
    }
  };

  return (
    <>
      <Landing_Header src="xl" title="failed_booked" />
      <div className=" secondary_border px-6 py-10 max-w-[600px] mx-auto flex flex-col gap-4 sm:gap-8 ">
        <header className="flex_center text-center flex-col gap-5">
          <span>
            <CardRemoveIcon
              width="40"
              height="40"
              fill="var(--color-secondary-1)"
            />
          </span>
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-[32px] !font-bold text-secondary-1">
            {t("booking_failed")}
          </h2>
          <p className="text-secondary-light text-xs sm:text-sm lg:text-base">
            {t("failed_payment_des")}
          </p>
        </header>

        {/* retry Button */}
        <div className="flex justify-center mt-6">
          <Button
            type="primary"
            loading={loader}
            onClick={handleRetryPayment}
            className="px-6 py-2"
          >
            {t("retry_payment")}
          </Button>
        </div>
      </div>
    </>
  );
};
const Success_Payment = ({ id }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      // A guest comes back from the gateway without a session, so the
      // booking's own token identifies it.
      const guestToken = getGuestToken(id);
      const response = await axiosInstance.get(
        `${API.payment.details}${id}/${
          guestToken ? `?access_token=${guestToken}` : ""
        }`
      );
      const fetchedData = response.data;
      setData(fetchedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  const paidAmount =
    data?.paid !== undefined && data?.paid !== null && parseFloat(data?.paid) > 0
      ? data?.paid
      : data?.total_price;

  const list = {
    from: `${data?.dates?.date_from || data?.check_in || "-"}`,
    to: `${data?.dates?.date_to || data?.check_out || "-"}`,
    number_of_guests: (data?.persons_max_num || 0) + (data?.kids_max_num || 0),
    // Without this guard a failed fetch renders the literal "undefinedsar".
    subtotal:
      paidAmount === undefined || paidAmount === null
        ? "-"
        : `${paidAmount}${t("sar")}`,
  };

  const qrImageUrl = getImageUrl(data?.qr_code_image);
  // A deposit leaves a balance, and no entry pass is issued until it clears.
  const balanceDue = Number(data?.not_paid ?? 0);
  const isPartiallyPaid = balanceDue > 0;

  const payRemaining = async () => {
    try {
      setLoading(true);
      const guestToken = getGuestToken(id);
      const response = await axiosInstance.post(API.payment.checkout, {
        booking_id: id,
        ...(guestToken ? { access_token: guestToken } : {}),
      });
      if (response.status === 201) {
        navigate(`/payment/${response?.data?.checkout_id}`);
      }
    } catch (err) {
      console.error("Failed to start balance payment:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Landing_Header
        src="xl"
        title={isPartiallyPaid ? "deposit_received_banner" : "booked_succecffuly"}
      />
      <div className="flex flex-col gap-4 sm:gap-8 md:gap-12 lg:gap-16">
        <header className="flex_center text-center flex-col gap-5">
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-[32px] !font-bold text-secondary-1">
            {t(isPartiallyPaid ? "deposit_received_title" : "success_payment_title")}
          </h2>
          <p className="text-secondary-light text-xs sm:text-sm lg:text-base">
            {t(isPartiallyPaid ? "deposit_received_des" : "success_payment_des")}
          </p>
        </header>
        <div className="flex flex-col md:flex-row gap-8 xl:gap-[123px]">
          <Payment_Booking_Details
            data={list}
            loading={loading}
            className="w-full md:w-1/2 md:max-w-[577px]"
          />
          {isPartiallyPaid ? (
            <Payment_Ticket_Card
              className="w-full md:w-1/2 md:max-w-[540px]"
              title="balance_due"
              description="deposit_qr_pending"
              loading={loading}
              button={() => (
                <Button loading={loading} disabled={loading} onClick={payRemaining}>
                  {`${t("pay_balance")} (${data?.not_paid} ${t("sar")})`}
                </Button>
              )}
            />
          ) : (
            <Payment_Ticket_Card
              className="w-full md:w-1/2 md:max-w-[540px]"
              title="your_qr_code"
              description="qr_des"
              img={qrImageUrl}
              loading={loading}
              button={() => (
                <Button
                  onClick={() => {
                    if (qrImageUrl) {
                      downloadFile(qrImageUrl, "ticket.png", t);
                    }
                  }}
                >
                  {t("download_ticket")}
                </Button>
              )}
            />
          )}
        </div>
        {/* Raised in Daftra when the payment landed. Absent until that
            succeeds, so the link only shows once there is one to open. */}
        {data?.invoice_url && (
          <div className="Container flex justify-center">
            <a
              href={data.invoice_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-full border border-primary-dark px-8 py-3 text-primary-3 text-sm sm:text-base"
            >
              {t(isPartiallyPaid ? "view_partial_invoice" : "view_invoice")}
            </a>
          </div>
        )}
      </div>
    </>
  );
};
export default Payment_Results;
