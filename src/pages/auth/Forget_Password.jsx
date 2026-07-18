import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { emailRegex } from "../../utils/validator";
import { EmailIcon } from "../../assets/icons/Icon";
import Button from "../../components/shared/Button";
import Form from "../../components/shared/form/Form";
import Auth_Header from "../../components/layout/header/Auth_Header";
import axiosInstance from "../../service/axiosInstance";
import { API } from "../../service/apiUrl";
import { handleErrors } from "../../utils/handleError";

const Forget_Password = () => {
  const { t } = useTranslation();
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
      email: "",
    },
    mode: "onChange",
  });
  // ____________ function __________________
  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const response = await axiosInstance.post(API.auth.sendOtp, data);
      if (response.status === 200) {
        navigate(`/account/${data.email}/otp`);
      }
    } catch (err) {
      handleErrors(err, setError, t);
    } finally {
      setLoading(false);
    }
  };
  //list
  const formList = [
    {
      id: 1,
      formType: "input",
      fieldName: "email",
      name: "email",
      type: "email",
      label: "email",
      placeholder: "email_placeholder",
      validator: {
        required: "required_field",
        pattern: {
          value: emailRegex,
          message: "invalid_email_format",
        },
      },
      icon: <EmailIcon />,
      hasRequiredStar: true,
    },
  ];
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-8 justify-center items-center min-h-[50svh] mx-auto max-w-[500px]"
    >
      <div className="flex flex-col  gap-6 lg:gap-12   w-full sm:min-w-[400px] ">
        <Auth_Header
          title="forget_password_title"
          des="forget_password_des"
          className="text-center"
        />
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
          role="submit"
          disabled={loading}
          loading={loading}
          type="secondary"
        >
          {" "}
          {t("send")}
        </Button>
      </div>
    </form>
  );
};

export default Forget_Password;
