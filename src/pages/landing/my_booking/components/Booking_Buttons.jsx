import React, { useState } from "react";
import Button from "../../../../components/shared/Button";
import { useTranslation } from "react-i18next";
import { TrailingIcon } from "../../../../assets/icons/Icon";
import { currentLanguageCode } from "../../../../utils/switchLang";
import Modal from "../../../../components/shared/popup/Modal";
import { useAuth } from "../../../../context/Auth_Context";
import { MessageRecived } from "../../../../assets/images/Image";
import { handleErrors } from "../../../../utils/handleError";
import axiosInstance from "../../../../service/axiosInstance";
import { API } from "../../../../service/apiUrl";
import { useForm } from "react-hook-form";
import Form from "../../../../components/shared/form/Form";
import { useNavigate } from "react-router-dom";
import { formatDateToYYYYMMDD } from "../../../../utils/formateDateToYYYYMMDD";
import { toast } from "react-toastify";

const Booking_Buttons = ({ id, isCancelled, available_dates }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  // extra days popup
  const [visibleExtraDaysPopup, setVisibleExtraDaysPopup] = useState(false);
  const [extraDaysLoader, setExtraDaysLoader] = useState(false);

  // cancellation popup
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // ___________ useform _________
  const {
    control,
    setError,
    watch,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      date_from: null,
      date_to: null,
    },
    mode: "onChange",
  });

  const handleCancellation = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.post(
        `${API.user_booking.cancellation}${id}/`,
        {}
      );

      if (response.status === 200) {
        setVisible(true);
      }
    } catch (err) {
      handleErrors(err, null, t);
    } finally {
      setLoading(false);
    }
  };
  const handleAddExtraDays = async (data) => {
    try {
      setExtraDaysLoader(true);
      const response = await axiosInstance.post(
        `${API.booking.details}${id}/add-extra-dates/`,
        {
          date_from: formatDateToYYYYMMDD(data.date_from),
          date_to: formatDateToYYYYMMDD(data.date_to),
          is_confirmed: true,
        }
      );

      if (response.status === 201) {
        toast.success(t("confirm_extra_days_payment"));
        navigate(`/${id}/payment`);
        setVisibleExtraDaysPopup(false);
      }
    } catch (err) {
      handleErrors(err, setError, t);
    } finally {
      setExtraDaysLoader(false);
    }
  };

  const formList = [
    {
      id: 0,
      formType: "calendar",
      fieldName: "date_from",
      label: "from",
      name: "from",
      placeholder: `5-5-${new Date().getFullYear()}`,
      validator: {
        required: "required_field",
      },

      allowedDates: available_dates,
    },
    {
      id: 1,
      formType: "calendar",
      fieldName: "date_to",
      label: "to",
      name: "to",
      placeholder: `5-5-${new Date().getFullYear()}`,
      allowedDates: available_dates,
      validator: {
        required: "required_field",
        validate: (value) => {
          const fromDate = watch("date_from");
          if (fromDate) {
            const fromValue = new Date(fromDate);
            const toValue = new Date(value);

            fromValue.setHours(0, 0, 0, 0);
            toValue.setHours(0, 0, 0, 0);

            if (isNaN(fromValue.getTime()) || isNaN(toValue.getTime())) {
              return "invalid_date";
            }

            if (toValue <= fromValue) {
              return "to_date_must_be_after_from";
            }
          } else {
            setError("date_from", {
              type: "manual",
              message: "required_field",
            });
            return "set_from_date";
          }

          return true;
        },
      },
    },
  ];
  return (
    <>
      <div className="flex flex-col xs:flex-row items-center gap-3 sm:gap-5 justify-between">
        <Button
          rounded="full"
          className="max-w-full sm:max-w-[400px]"
          type="secondary_light"
          to={`/${id}/service/confirm-booking`}
        >
          {t("add_services")}
          <span className={currentLanguageCode === "en" ? "" : "rotate-180"}>
            <TrailingIcon />
          </span>
        </Button>
        <Button
          rounded="full"
          className="max-w-full sm:max-w-[400px]"
          type="secondary_light"
          onClick={() => setVisibleExtraDaysPopup(true)}
        >
          {t("book_extra_days")}
          <span className={currentLanguageCode === "en" ? "" : "rotate-180"}>
            <TrailingIcon />
          </span>
        </Button>
        <Button
          rounded="full"
          className="max-w-full sm:max-w-[280px]"
          type={isCancelled ? "disabled" : "secondary_light"}
          loading={loading}
          disabled={loading}
          onClick={() => {
            if (!isCancelled) {
              handleCancellation();
            }
          }}
        >
          {t("cancel_requests")}
        </Button>
      </div>
      {/* cancellation modal */}
      <Modal open={visible} onClose={() => setVisible(false)} loading={loading}>
        <div className="flex items-center flex-col ">
          <h3
            className="text-primary2 max-w-[400px] text-center text-base xs:text-lg "
            dangerouslySetInnerHTML={{
              __html: `${t("contact_you_soon")} <span class="font-semibold" >${
                user.email
              }</span> ${t("reply_cancellation")}`,
            }}
          />
          <img
            src={MessageRecived}
            alt="message recived image"
            className="w-[250px] sm:w-[300px]"
          />
          <Button
            onClick={() => {
              setVisible(false);
            }}
          >
            {t("ok")}
          </Button>
        </div>
      </Modal>
      {/* extra days model */}
      <Modal
        open={visibleExtraDaysPopup}
        onClose={() => setVisibleExtraDaysPopup(false)}
        loading={extraDaysLoader}
      >
        <form
          onSubmit={handleSubmit(handleAddExtraDays)}
          className="flex  flex-col w-full max-w-[516px] gap-8 "
        >
          <h3 className="text-primary2 max-w-[400px]  text-base xs:text-lg opacity-90 ">
            {t("extend_reservation_until")}
          </h3>
          <div className="flex flex-col gap-5">
            <h2 className="text-secondary text-sm xs:text-base font-bold">
              {t("new_date")}
            </h2>
            <Form
              formList={formList}
              control={control}
              errors={errors}
              loading={loading}
              setError={setError}
            />
          </div>
          <Button
            role="submit"
            loading={extraDaysLoader}
            disabled={extraDaysLoader}
          >
            {t("go_to_payment")}
          </Button>
        </form>
      </Modal>
    </>
  );
};

export default Booking_Buttons;
