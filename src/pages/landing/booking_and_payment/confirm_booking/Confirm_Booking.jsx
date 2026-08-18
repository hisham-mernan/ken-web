import React, { useEffect, useState } from "react";

// lib
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

// components
import Add_Services from "./components/Add_Services";
import Confirm_Events from "./components/Confirm_Events";
import Button from "../../../../components/shared/Button";
import Booking_Hut from "../../huts/huts_details/components/Booking_Hut";
import Special_Items from "../../../../components/shared/ken_special_item/Special_Items";
import Right_Text_Header from "../../../../components/layout/header/Right_Text_Header";

//service
import { API } from "../../../../service/apiUrl";

// hook
import useGetData from "../../../../hooks/useGetData";
import { handleErrors } from "../../../../utils/handleError";

import axiosInstance from "../../../../service/axiosInstance";
import { formatDateToYYYYMMDD } from "../../../../utils/formateDateToYYYYMMDD";
import { getGuestToken } from "../../../../utils/guestBooking";
import { toast } from "react-toastify";
import Page_Nout_Found from "../../404/Page_Nout_Found";
import Landing_Header from "../../../../components/layout/header/Landing_Header";
import Guest_Form from "./components/Guest_Form";
import { useAuth } from "../../../../context/Auth_Context";

const Confirm_Booking = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { id, type } = useParams();
  const [special, setSpecial] = useState([]);
  // for service and event list
  const [serviceList, setServiceList] = useState([]);
  const [eventList, setEventList] = useState([]);
  const { token } = useAuth();
  // tickets
  const [eventTickets, setEventTickets] = useState([]);
  const [serviceTickets, setServiceTickets] = useState([]);
  const [serviceAndEventLoader, setServiceAndEventLoader] = useState(false);

  // guest form
  const [toggleGuestForm, setToggleGuestForm] = useState(false);
  // "full" or "deposit" -- how much to take now.
  const [paymentOption, setPaymentOption] = useState("full");
  // ___________ useform _________
  const {
    control,
    setError,
    watch,
    reset,
    getValues,
    setValue,
    formState: { errors, dirtyFields, isDirty },
    handleSubmit,
  } = useForm({
    defaultValues: {
      date_from: null,
      date_to: null,
      persons_max_num: null,
      kids_max_num: null,
    },
    mode: "onChange",
  });
  const defaultValues = (data) => {
    if (data?.dates) {
      getEventsAndServices();
      setValue("date_from", new Date(data?.dates?.date_from));
      setValue("date_to", new Date(data?.dates?.date_to));
      setValue("persons_max_num", data.persons_max_num);
      setValue("kids_max_num", data.kids_max_num);
      setValue("hut", data.hut_details?.id);

      setSpecial(
        data?.special_items?.map((val) => ({
          item: val?.item,
          quantity: val?.quantity,
          price: val?.price,
        }))
      );
    }
  };
  // A guest has no session here, so the booking's own token identifies it.
  const { data, error } = useGetData(
    `${API.booking.details}${id}/${
      getGuestToken(id) ? `?access_token=${getGuestToken(id)}` : ""
    }`,
    defaultValues
  );

  // ______________ function ___________
  const handlePayment = async (bookingId, option = paymentOption) => {
    try {
      setLoading(true);
      // A guest has no session, so the booking's own token authorises this.
      const guestToken = getGuestToken(bookingId ?? id);
      const response = await axiosInstance.post(API.payment.checkout, {
        booking_id: bookingId,
        // Omitted entirely for a full payment, so the server keeps its
        // existing default rather than relying on a magic string.
        ...(option === "deposit" ? { payment_option: "deposit" } : {}),
        ...(guestToken ? { access_token: guestToken } : {}),
      });
      if (response.status === 201) {
        navigate(`/payment/${response?.data?.checkout_id}`);
      }
    } catch (err) {
      handleErrors(err, setError, t);
    } finally {
      setLoading(false);
    }
  };
  // guestDetails is supplied by Guest_Form when nobody is signed in; the
  // backend requires those contact details before it will confirm a booking
  // that has no account behind it.
  //
  // Never pass this straight to react-hook-form. handleSubmit invokes its
  // callback as (values, event), so a signed-in user's submit would land the
  // SyntheticEvent in the guestDetails slot; Object.assign then spread the
  // event's DOM references into the body and axios could not serialise it,
  // so the request was never sent and registered users could not book.
  const submitBooking = async (data, guestDetails = null) => {
    try {
      setLoading(true);
      let dataToSend = { ...data };
      delete dataToSend.date_from;
      delete dataToSend.date_to;
      if (guestDetails) {
        Object.assign(dataToSend, guestDetails);
      }
      const guestToken = getGuestToken(id);
      if (guestToken) {
        dataToSend.access_token = guestToken;
      }
      dataToSend.date = {
        date_from: formatDateToYYYYMMDD(data.date_from),
        date_to: formatDateToYYYYMMDD(data.date_to),
      };
      dataToSend.special_items = special;
      if (serviceTickets?.length > 0) {
        dataToSend.services = serviceTickets;
      }
      if (eventTickets?.length > 0) {
        dataToSend.events = eventTickets;
      }
      dataToSend.status = "confirmed";

      const response = await axiosInstance.put(
        `${API.booking.confirm.update}${id}/`,
        dataToSend
      );
      if (response.status === 200) {
        toast.success(t("successfully_book_hut"));
        // navigate(`/payment/${response?.data?.id}`);
        handlePayment(response?.data?.id);
      }
    } catch (err) {
      const error = err?.response?.data?.error.error;
      if (error === "Booking is already confirmed.") {
        handlePayment(error?.id);
      }
      handleErrors(err, setError, t);
    } finally {
      setLoading(false);
    }
  };
  // extra service
  const addNewExtraService = async () => {
    try {
      // need to change
      setLoading(true);
      const sendData = {
        booking: id,

        tickets: serviceTickets?.map((item) => ({
          is_confirmed: true,
          is_extra: true,
          date: item?.date,
          service: item?.service,
          quantity: item?.quantity,
        })),
      };

      const response = await axiosInstance.post(
        API.booking.confirm.extra_service,
        sendData
      );
      if (response.status === 201) {
        toast.success(t("confirm_extra_services_payment"));

        handlePayment(response?.data?.at(0)?.booking_id);
        // navigate(`/payment/${response?.data?.[0]?.id}`);
      }
    } catch (err) {
      handleErrors(err, setError, t);
    } finally {
      setLoading(false);
    }
  };
  // to get events and services at that time
  const getEventsAndServices = async () => {
    try {
      setServiceAndEventLoader(true);

      const response = await axiosInstance.post(
        API.booking.confirm.upcoming_event_and_servicse,
        {
          booking_id: id,
          ...(getGuestToken(id) ? { access_token: getGuestToken(id) } : {}),
        }
      );

      setEventList(response?.data.available_events);
      setServiceList(response?.data.available_services);
    } catch (err) {
      // handleErrors(err, null, t);
    } finally {
      setServiceAndEventLoader(false);
    }
  };
  console.log(
    type,
    "typ",
    serviceList?.length === 0 && eventList?.length === 0
  );
  // will need to added logic to check if there's available dates or not
  const emptyPage =
    type === "service"
      ? serviceList?.length === 0 && eventList?.length === 0
      : type === "extend"
      ? data?.available_dates?.length === 0
      : false;

  // for now i handle service need to handel exten also when apply code
  const disabledButton = type === "service" && serviceTickets?.length === 0;

  if (error?.error === "Booking not found.") {
    return <Page_Nout_Found text="booking_not_found" />;
  }

  return (
    <main className="layout_bg page_p flex flex-col gap-20 pb-[129px] ">
      <div className="Container">
        <Landing_Header src="2xl" title="confirm_booking" />
      </div>
      <form
        onSubmit={handleSubmit(
          type === "service"
            ? addNewExtraService
            : // Drop handleSubmit's second argument (the submit event).
              (values) => submitBooking(values)
        )}
        className="flex flex-col gap-20"
      >
        {type === "confirm" && (
          <Booking_Hut
            special={special}
            data={data}
            setError={setError}
            watch={watch}
            errors={errors}
            control={control}
            loading={loading}
            isDisabled={true}
            isConfirm={true}
            eventTickets={eventTickets}
            serviceTickets={serviceTickets}
            available_dates={data?.hut_details?.available_dates}
          />
        )}
        {/* events */}
        {type === "confirm" && (
          <Confirm_Events
            ticket={eventTickets}
            setTicket={setEventTickets}
            loading={serviceAndEventLoader}
            data={eventList}
          />
        )}
        {/* end events */}
        {(type === "confirm" || type === "service") && (
          <Add_Services
            ticket={serviceTickets}
            setTicket={setServiceTickets}
            loading={serviceAndEventLoader}
            data={serviceList}
            noAvailableService={
              !serviceAndEventLoader &&
              type === "service" &&
              serviceList?.length === 0
                ? true
                : false
            }
          />
        )}
        {type === "confirm" && data?.hut_details?.id && (
          <Special_Items
            isConfirm={true}
            special={special}
            setSpecial={setSpecial}
            id={data?.hut_details?.id}
          />
        )}

        {/* Only offered on a first payment: once a deposit exists the server
            always charges the whole remaining balance. */}
        <div
          className={`Container flex-col gap-3 ${
            emptyPage || type === "service" ? "hidden" : "flex"
          }`}
        >
          <span className="title_lg text-primary-3">{t("payment_option")}</span>
          <div className="flex flex-col sm:flex-row gap-3">
            {[
              { value: "full", label: "pay_in_full" },
              { value: "deposit", label: "pay_deposit" },
            ].map((option) => (
              <label
                key={option.value}
                className={`flex-1 flex items-center gap-3 px-4 py-3 rounded-lg border cursor-pointer ${
                  paymentOption === option.value
                    ? "border-primary-dark bg-primary-5"
                    : "border-font-light"
                }`}
              >
                <input
                  type="radio"
                  name="payment_option"
                  value={option.value}
                  checked={paymentOption === option.value}
                  onChange={() => setPaymentOption(option.value)}
                  className="accent-primary-dark"
                />
                <span className="text-primary-3">{t(option.label)}</span>
              </label>
            ))}
          </div>
          {paymentOption === "deposit" && (
            <p className="body_sm text-primary-4">{t("pay_deposit_note")}</p>
          )}
        </div>

        <div className={`Container ${emptyPage ? "hidden" : "flex"}`}>
          <Button
            role={token ? "submit" : "button"}
            loading={loading}
            disabled={loading || disabledButton}
            // to={`/1/payment`}
            onClick={() => {
              if (!token) {
                setToggleGuestForm(true);
              }
            }}
            className="uppercase"
          >
            {t("go_to_payment")}
          </Button>
        </div>
      </form>
      <Guest_Form
        open={toggleGuestForm}
        onClose={() => setToggleGuestForm(false)}
        // Details go straight into the same confirm call a signed-in user
        // makes, rather than being stored separately first.
        onConfirm={(guestDetails) => submitBooking(getValues(), guestDetails)}
      />
    </main>
  );
};

export default Confirm_Booking;
