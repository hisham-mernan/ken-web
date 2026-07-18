import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { handleErrors } from "../../../../utils/handleError";
import { toast } from "react-toastify";
import axiosInstance from "../../../../service/axiosInstance";
import Form from "../../../../components/shared/form/Form";
import { EmailIcon } from "../../../../assets/icons/Icon";
import Button from "../../../../components/shared/Button";
import { useTranslation } from "react-i18next";
import Modal from "../../../../components/shared/popup/Modal";
import { ThanksImage } from "../../../../assets/images/Image";
import { API } from "../../../../service/apiUrl";

const Rate = ({ onClose, setVisible, bookingId }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    setError,
    reset,
  } = useForm({ value: null, content: "" }, { mode: "onChange" });

  // function
  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const response = await axiosInstance.post(
        `${API.rating.review}${bookingId}/`,
        data
      );
      if (response.status === 201) {
        onClose();
        setVisible(true);
        toast.success(t("thank_guest"));
        reset();
      }
    } catch (err) {
      handleErrors(err, null, t);
      if (
        err?.response?.data?.non_field_errors?.at(0) ===
        "You already rated this hut."
      ) {
        onClose();
      }
    } finally {
      setLoading(false);
    }
  };

  const formList = [
    {
      id: 0,
      formType: "star",
      fieldName: "value",
      name: "rating",
      validator: {
        required: "required_field",
      },
      des: "rate_des",
    },
    {
      id: 1,
      formType: "textarea",
      fieldName: "content",

      placeholder: "give_us_feadback",
      validator: {
        required: "required_field",
      },
      icon: <EmailIcon />,
    },
  ];
  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-[400px] w-full flex flex-col gap-8"
      >
        {" "}
        <Form
          formList={formList}
          control={control}
          errors={errors}
          loading={loading}
          setError={setError}
        />
        <Button role="submit" loading={loading}>
          {t("send")}
        </Button>
      </form>
    </>
  );
};

export default Rate;
