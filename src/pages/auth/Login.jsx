import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { emailRegex } from "../../utils/validator";
import {
  AppleIcon,
  EmailIcon,
  GoogleIcon,
  KeyIcon,
} from "../../assets/icons/Icon";
import Auth_Header from "../../components/layout/header/Auth_Header";
import Form from "../../components/shared/form/Form";
import Button from "../../components/shared/Button";
import axiosInstance from "../../service/axiosInstance";
import { API } from "../../service/apiUrl";
import { useAuth } from "../../context/Auth_Context";
import { handleErrors } from "../../utils/handleError";
import { continueWithGoogle } from "../../utils/continueWithGoogle";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
export const dashboardsUrl = import.meta.env.VITE_REACT_APP_DASHBOARDS_ROUTES;
const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [loadingOtp, setLoadingOtp] = useState(false);

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
      email: "",
      password: null,
    },
    mode: "onChange",
  });
  // ____________ function __________________
  // for send otp when user account not verified
  const sendOtp = async (email) => {
    try {
      setLoadingOtp(true);
      const response = await axiosInstance.post(API.auth.sendOtp, {
        email: email,
      });
      if (response.status === 200) {
        Cookies.set("otp_timer", 60, { expires: 1 / 1440 });
        navigate(`/account/${email}/verify-account`);
      }
    } catch (err) {
      // handleErrors(err, setError, t);
    } finally {
      setLoadingOtp(false);
    }
  };
  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const response = await axiosInstance.post(API.auth.login, data);

      if (response.status === 200) {
        toast.success(t("successfully_logged_in"));
        if (response.data.role === "guest") {
          login(response.data, Cookies.get("from_details") ? false : true);
          if (Cookies.get("from_details")) {
            navigate(`/huts/${Cookies.get("from_details")}/details`);
            Cookies.remove("from_details");
          }
        } else {
          window.location.replace(
            `${dashboardsUrl}${response.data.role}?role=${response.data.role}&token=${response.data.token}`
          );
        }
      }
    } catch (err) {
      const error = err?.response?.data;
      if (error?.non_field_errors?.at(0) === "This user is not verified.") {
        sendOtp(watch("email"));
      } else {
        handleErrors(err, setError, t, navigate, data?.email);
      }
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
    {
      id: 2,
      formType: "input",
      fieldName: "password",
      label: "password",
      type: "password",
      placeholder: "password",
      validator: {
        required: "required_field",
      },
      icon: <KeyIcon />,
      showForgetPassword: true,
      hasRequiredStar: true,
    },
  ];
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
      <Auth_Header title="login" des="sign_up_des" />
      <div className="flex flex-col gap-6">
        <Form
          formList={formList}
          control={control}
          errors={errors}
          loading={loading || loadingOtp}
          setError={setError}
        />
      </div>
      {/* pause of not untill backend make it work */}
      {/* <span className="body_lg text-black mx-auto font-blinker">{t("or")}</span> */}
      <footer className="flex flex-col gap-8">
        {/* <section className="grid grid-cols-1 xs:grid-cols-2 gap-4 lg:gap-10 ">
          <Button
            onClick={continueWithGoogle}
            type="outline"
            className="!text-base !font-normal "
          >
            <GoogleIcon />
            <span>{t("continue_with_google")}</span>
          </Button>
          <Button type="outline" className="!text-base !font-normal ">
            <AppleIcon />
            <span>{t("continue_with_apple")}</span>
          </Button>
        </section> */}
        <Button
          role="submit"
          type="secondary"
          loading={loading || loadingOtp}
          disabled={loading || loadingOtp}
        >
          {" "}
          {t("login")}
        </Button>
        <p className="text-[#817D85] font-[300] text-sm flex_center_y gap-1 ">
          <span>{t("dont_have_account")}</span>
          <Link className="text-primary-dark" to="/account/register">
            {t("sign_up")}
          </Link>
        </p>
      </footer>
    </form>
  );
};

export default Login;
