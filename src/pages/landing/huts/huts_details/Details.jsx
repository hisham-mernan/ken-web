import React, { useState } from "react";

// lib
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

// components
import Content from "./components/Content";
import Activity from "./components/Activity";
import Location from "./components/Location";
import Booking_Hut from "./components/Booking_Hut";
import Page_Nout_Found from "../../404/Page_Nout_Found";
import Support from "../../../../components/shared/support/Support";
import Testimonials from "../../../../components/shared/testimonials/Testimonials";
import Special_Items from "../../../../components/shared/ken_special_item/Special_Items";
import { SHOW_SPECIAL_ITEMS } from "../../../../config/features";
import Right_Text_Header from "../../../../components/layout/header/Right_Text_Header";

// service
import { API } from "../../../../service/apiUrl";
import axiosInstance from "../../../../service/axiosInstance";

// utils
import { handleErrors } from "../../../../utils/handleError";
import { currentLanguageCode } from "../../../../utils/switchLang";
import { formatDateToYYYYMMDD } from "../../../../utils/formateDateToYYYYMMDD";
import { saveGuestToken } from "../../../../utils/guestBooking";

// hooks
import useGetData from "../../../../hooks/useGetData";
import { useAuth } from "../../../../context/Auth_Context";
import Landing_Header from "../../../../components/layout/header/Landing_Header";

const Details = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [special, setSpecial] = useState([]);
  const { token } = useAuth();
  const {
    data,
    loading: loadingData,
    error,
  } = useGetData(`${API.huts.details.detail}${id}/`);

  // for booking hut
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // ___________ useform _________
  const {
    control,
    setError,
    reset,
    watch,
    formState: { errors, dirtyFields, isDirty },
    handleSubmit,
  } = useForm({
    defaultValues: {
      hut: id,
      date_from: null,
      date_to: null,
      persons_max_num: null,
      kids_max_num: null,
      promocode: "",
      terms: false,
    },
    mode: "onChange",
  });
  // ____________ function __________________
  const onSubmit = async (data) => {
    try {
      setLoading(true);
      let dataToSend = { ...data };

      delete dataToSend.date_from;
      delete dataToSend.date_to;

      const response = await axiosInstance.post(API.booking.create, {
        ...dataToSend,
        date: {
          date_from: formatDateToYYYYMMDD(data?.date_from),
          date_to: formatDateToYYYYMMDD(data?.date_to),
        },
        special_items: special,
      });
      if (response.status === 201) {
        // Returned only when the booking was made without an account. It is
        // what lets checkout and payment act on this booking later.
        if (response?.data?.access_token) {
          saveGuestToken(response.data.id, response.data.access_token);
        }
        navigate(`/${response?.data?.id}/confirm/confirm-booking`);
        reset();
      }
    } catch (err) {
      handleErrors(err, setError, t);
    } finally {
      setLoading(false);
    }
  };

  if (error?.detail?.includes("No Hut matches the given query.")) {
    return <Page_Nout_Found text="hut_not_found" />;
  }

  return (
    <main className="page_p flex flex-col gap-10 md:gap-20 layout_bg ">
      <div className="Container flex flex-col gap-10 md:gap-[72px">
        <Landing_Header
          title={currentLanguageCode === "en" ? data?.title : data?.title_ar}
        />
        <Content loading={loadingData} data={data} />
        <Activity loading={loadingData} data={data} />
        <Location loading={loadingData} data={data?.location} />
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Booking_Hut
          special={special}
          data={data}
          setError={setError}
          watch={watch}
          errors={errors}
          control={control}
          loading={loading}
          available_dates={data?.available_dates}
        />
      </form>
      {SHOW_SPECIAL_ITEMS && (
        <Special_Items special={special} setSpecial={setSpecial} id={id} />
      )}
      <Testimonials />
      <Support />
    </main>
  );
};

export default Details;
