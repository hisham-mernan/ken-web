import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { passwordPattern } from "../../utils/validator";
import { KeyIcon } from "../../assets/icons/Icon";
import Form from "../../components/shared/form/Form";
import Auth_Header from "../../components/layout/header/Auth_Header";
import Button from "../../components/shared/Button";
import axiosInstance from "../../service/axiosInstance";
import { API } from "../../service/apiUrl";
import { handleErrors } from "../../utils/handleError";

const Reset_Password = () => {
  const { t } = useTranslation();
  const { email } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
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
      email: email,
      new_password: null,
      confirm_password: null,
    },
    mode: "onChange",
  });
  // ____________ function __________________
  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const response = await axiosInstance.put(API.auth.reset_password, data);
      if (response.status === 200) {
        navigate(`/account/login`);
      }
    } catch (err) {
      handleErrors(err, setError, t, navigate);
    } finally {
      setLoading(false);
    }
  };
  // ____________ list __________________
  const formList = [
    {
      id: 1,
      formType: "input",
      type: "password",
      fieldName: "new_password",
      label: "password",

      placeholder: "password",
      validator: {
        required: "required_field",
        pattern: {
          value: passwordPattern,
          message: "wrong_password",
        },
      },
      icon: <KeyIcon />,

      hasRequiredStar: true,
    },
    {
      id: 6,
      formType: "input",

      type: "password",
      fieldName: "confirm_password",
      validator: {
        required: "required_field",
        validate: (value) => {
          const password = getValues("new_password");
          return value === password || "password_mismatch";
        },
      },
      placeholder: "confirm_password_placeholder",
      label: "confirm_password",

      hasRequiredStar: true,
      icon: <KeyIcon />,
    },
  ];
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
      <Auth_Header title="reset_password" des="reset_password_des" />
      <div className="flex flex-col gap-6">
        <Form
          formList={formList}
          control={control}
          errors={errors}
          loading={loading}
          setError={setError}
        />
      </div>
      <Button
        type="secondary"
        role="submit"
        loading={loading}
        disabled={loading}
      >
        {t("confirm_password")}
      </Button>
    </form>
  );
};

export default Reset_Password;
