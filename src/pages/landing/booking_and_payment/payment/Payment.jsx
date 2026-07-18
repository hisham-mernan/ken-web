import React from "react";

// components
import Right_Text_Header from "../../../../components/layout/header/Right_Text_Header";
import Payment_Booking_Card from "./components/Payment_Booking_Card";
import Payment_Methods from "./components/Payment_Methods";
import useGetData from "../../../../hooks/useGetData";
import { API } from "../../../../service/apiUrl";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import Landing_Header from "../../../../components/layout/header/Landing_Header";

const Payment = () => {
  const { id } = useParams();
  const { t } = useTranslation();

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
      events: [],
      services: [],
      hut: null,
    },
    mode: "onChange",
  });
  const defaultValues = (formData) => {
    if (formData?.dates) {
      setValue("date_from", formData?.dates?.date_from);
      setValue("date_to", formData?.dates?.date_to);
    }
    setValue("persons_max_num", formData.persons_max_num);
    setValue("kids_max_num", formData.kids_max_num);
    setValue("hut", formData.hut_details?.id);
    setValue("events", formData.events);
    setValue("services", formData.services);
    setValue("events_tickets_count", formData?.events_tickets_count);
  };
  const {
    data,
    error,
    loading: loadingData,
  } = useGetData(`${API.payment.details}${id}/`, defaultValues);

  // NOT IN USE
  return (
    <>
      <section className="flex flex-col gap-10 md:gap-16  pb-[149px]">
        <Landing_Header title="Payment" />
        <div className="flex flex-col gap-10 md:gap-16 lg:gap-20">
          <Payment_Booking_Card
            data={data}
            dataLoader={loadingData}
            errors={errors}
            control={control}
            setError={setError}
          />
          <Payment_Methods />{" "}
        </div>
      </section>
    </>
  );
};

export default Payment;
