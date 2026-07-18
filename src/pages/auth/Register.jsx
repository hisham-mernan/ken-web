import React, { useState } from "react";
import Auth_Header from "../../components/layout/header/Auth_Header";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import {
  emailRegex,
  genericNationalIdPattern,
  namePattern,
  passwordPattern,
  saudiPhoneNumberRegex,
} from "../../utils/validator";
import Form from "../../components/shared/form/Form";
import {
  AppleIcon,
  EmailIcon,
  GoogleIcon,
  IdIcon,
  KeyIcon,
  UserIcon,
  UserSquareIcon,
} from "../../assets/icons/Icon";
import Button from "../../components/shared/Button";
import { handleErrors } from "../../utils/handleError";
import { toast } from "react-toastify";
import axiosInstance from "../../service/axiosInstance";
import { API } from "../../service/apiUrl";
import { allowOnlyNumbers } from "../../utils/allowOnlyNumbers";
import { useAuth } from "../../context/Auth_Context";

const Register = () => {
  const { t } = useTranslation();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const isSupplierForm = location.pathname.includes("supplier");
  const formTitle = isSupplierForm ? "supplier_form" : "sign_up_title";
  const formDescription = isSupplierForm ? "supplier_form_des" : "sign_up_des";
  const btnName = isSupplierForm ? "send_request" : "sign_up";
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
      full_name: "",
      id_num: "",
      email: "",
      phone: null,
      password: null,
      confirm_password: null,
    },
    mode: "onChange",
  });
  // ____________ function __________________
  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const response = await axiosInstance.post(API.auth.register, {
        ...data,
        phone: `+966${data?.phone}`,
      });
      if (response.status === 201) {
        if (isSupplierForm) {
          toast.success(t("supplier_created_success"));
          if (token) {
            navigate(`/`);
          } else {
            navigate(`/account/login`);
          }
        } else {
          navigate(`/account/${data?.email}/verify-account`);
        }
        reset();
      }
    } catch (err) {
      handleErrors(err, setError, t);
    } finally {
      setLoading(false);
    }
  };
  // ____________ list __________________
  const formList = [
    {
      id: 1,
      formType: "input",
      fieldName: "full_name",
      label: "full_name",
      name: "full_name",
      placeholder: "full_name_placeholder",
      validator: {
        required: "required_field",
        pattern: {
          value: namePattern,
          message: "invalid_name",
        },
        maxLength: {
          value: 50,
          message: `${t("max_length_error", { length: 50 })}`,
        },
      },
      icon: <UserIcon />,
      hasRequiredStar: true,
    },
    {
      id: 2,
      formType: "input",
      fieldName: "id_num",
      name: "id_number",
      label: "id_number",
      placeholder: "id_number_placeholder",
      validator: {
        required: "required_field",
        pattern: {
          value: genericNationalIdPattern,
          message: "id_validation",
        },
        maxLength: {
          value: 16,
          message: `${t("max_value", { value: 16 })}`,
        },
      },
      icon: <IdIcon />,
      hasRequiredStar: true,
      onKeyDown: (e) => allowOnlyNumbers(e),
    },
    {
      id: 3,
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
        maxLength: {
          value: 250,
          message: `${t("max_value", { value: 250 })}`,
        },
      },
      icon: <EmailIcon />,
      hasRequiredStar: true,
    },
    {
      id: 4,
      formType: "phone_number",
      fieldName: "phone",
      type: "number",
      label: "phone_number",
      placeholder: "phone_number",
      validator: {
        required: "required_field",
        pattern: {
          value: saudiPhoneNumberRegex,
          message: "invalid_phone_number",
        },
      },
      hasRequiredStar: true,
    },
    isSupplierForm && {
      id: 5,
      formType: "input",
      fieldName: "breif",
      type: "text",
      label: "brief",
      placeholder: "company_brief",
      validator: {
        required: "required_field",
        maxLength: {
          value: 250,
          message: `${t("max_length_error", { length: 250 })} `,
        },
      },
      className: "col-span-1 lg:col-span-2",
      hasRequiredStar: true,
      icon: <UserSquareIcon />,
    },
    {
      id: 6,
      formType: "input",
      type: "password",
      fieldName: "password",
      label: "password",
      placeholder: "password",
      validator: {
        required: "required_field",
        pattern: {
          value: passwordPattern,
          message: "wrong_password",
        },
        maxLength: {
          value: 250,
          message: `${t("max_value", { value: 250 })}`,
        },
      },
      icon: <KeyIcon />,
      showForgetPassword: false,
      hasRequiredStar: true,
    },
    {
      id: 7,
      formType: "input",
      type: "password",
      fieldName: "confirm_password",
      validator: {
        required: "required_field",
        validate: (value) => {
          const password = getValues("password");
          return value === password || "password_mismatch";
        },
      },
      placeholder: "confirm_password_placeholder",
      label: "confirm_password",
      showForgetPassword: false,
      hasRequiredStar: true,
      icon: <KeyIcon />,
    },
  ];
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
      <Auth_Header title={formTitle} des={formDescription} />
      <div className="grid lg:grid-cols-2 gap-4 lg:gap-6">
        <Form
          formList={formList}
          control={control}
          errors={errors}
          loading={loading}
          setError={setError}
        />
      </div>
      {/* <span className="body_lg text-black mx-auto font-blinker">{t("or")}</span> */}
      <footer className="flex flex-col gap-8">
        {/* <section className="grid grid-cols-1 xs:grid-cols-2 gap-4 lg:gap-10 ">
          <Button type="outline" className="!text-base !font-normal ">
            <GoogleIcon />
            <span>{t("sign_up_with_google")}</span>
          </Button>
          <Button type="outline" className="!text-base !font-normal ">
            <AppleIcon />
            <span>{t("sign_up_with_apple")}</span>
          </Button>
        </section> */}
        <Button
          role="submit"
          type="secondary"
          loading={loading}
          disabled={loading}
        >
          {t(btnName)}
        </Button>
        {!isSupplierForm && (
          <p className="text-[#817D85] font-[300] text-sm flex_center_y gap-1 ">
            <span>{t("have_an_account")}</span>
            <Link className="text-primary-dark" to="/account/login">
              {t("login")}
            </Link>
          </p>
        )}
      </footer>
    </form>
  );
};

export default Register;
