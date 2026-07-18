import React, { useState } from "react";

// lib
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

// components
import Form from "../../../../../components/shared/form/Form";
import Button from "../../../../../components/shared/Button";

// assets
import {
  CalendarWithClose,
  CardIcon,
  CopyIcon,
} from "../../../../../assets/icons/Icon";

// utils
import { handleErrors } from "../../../../../utils/handleError";
import {
  cardNumberValidationPattern,
  cvvValidationPattern,
  nameValidationPattern,
} from "../../../../../utils/validator";
import axiosInstance from "../../../../../service/axiosInstance";
import { API } from "../../../../../service/apiUrl";
import { toast } from "react-toastify";

const Payment_Form = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  // ___________ useform _________
  const {
    control,
    setError,
    reset,
    getValues,
    formState: { errors, dirtyFields, isDirty },
    handleSubmit,
  } = useForm({
    defaultValues: {
      card_name: "",
      card_number: "",
      card_exp: null,
      card_cvv: null,
    },
    mode: "onChange",
  });
  // ____________ function __________________
  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const response = await axiosInstance.put(`${API.payment.payment}${id}/`);

      if (response?.status == 200) {
        toast.error(t("successfully_pay"));
      }
    } catch (err) {
      console.log("error", err);
      handleErrors(err, setError, t);
    } finally {
      setLoading(false);
    }
  };
  // ____________ list __________________
  const formList = [
    {
      id: 0,
      formType: "input",
      fieldName: "card_name",
      name: "card_name",
      label: "name_on_card",
      placeholder: "name_on_card",
      type: "text",
      validator: {
        required: "required_field",
        pattern: {
          value: nameValidationPattern,
          message: "enter_valid_name",
        },
      },
      icon: <CardIcon />,
    },
    {
      id: 1,
      formType: "input",
      fieldName: "card_number",
      name: "card_number",
      label: "card_number",
      placeholder: "1324-5465-5667-7666",

      type: "number",
      validator: {
        required: "required_field",
        pattern: {
          value: cardNumberValidationPattern,
          message: "enter_valid_card_number",
        },
      },
      icon: <CopyIcon />,
    },
    {
      id: 2,
      formType: "input",
      fieldName: "card_exp",
      name: "card_exp",
      label: "exp_date",
      placeholder: "MM-YY",
      type: "text",
      validator: {
        required: "requiredField",
        validate: (value) => {
          if (typeof value !== "string" || !value.includes(" / ")) {
            return "invalid_data_formate";
          }

          const [monthStr, yearStr] = value.split(" / ");
          const month = parseInt(monthStr, 10);
          const year = parseInt(yearStr, 10);

          if (
            isNaN(month) ||
            isNaN(year) ||
            month < 1 ||
            month > 12 ||
            yearStr.length !== 2
          ) {
            return "invalid_data_formate";
          }

          const currentDate = new Date();
          const currentYear = currentDate.getFullYear();
          const currentMonth = currentDate.getMonth();

          const fullYear = 2000 + year;
          const inputMonth = month - 1;

          if (
            fullYear < currentYear ||
            (fullYear === currentYear && inputMonth < currentMonth)
          ) {
            return "expiration_date_future";
          }

          return true;
        },
      },

      onInput: (e, field) => {
        let value = e.target.value.replace(/[^\d]/g, "");
        if (value.length > 2) {
          value = `${value.slice(0, 2)} / ${value.slice(2, 4)}`;
        }
        e.target.value = value;
        field.onChange(value);
      },
      icon: <CalendarWithClose />,
    },
    {
      id: 4,
      formType: "input",
      fieldName: "card_cvv",
      name: "card_cvv",
      label: "cvv",
      placeholder: "123",
      type: "number",
      validator: {
        required: "required_field",
        pattern: {
          value: cvvValidationPattern,
          message: "cvv_digits_only",
        },
      },
      icon: <CardIcon />,
    },
  ];
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="secondary_border form_p flex flex-col gap-[63px]"
    >
      {" "}
      <div className="flex flex-col gap-4 lg:gap-6">
        <Form
          formList={formList}
          control={control}
          errors={errors}
          loading={loading}
          setError={setError}
        />
      </div>
      <Button role="submit"> {t("pay_now")}</Button>
    </form>
  );
};

export default Payment_Form;
