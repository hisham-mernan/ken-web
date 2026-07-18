import { Link, useNavigate, useParams } from "react-router-dom";

import Cookies from "js-cookie";
import { useForm } from "react-hook-form";
import axiosInstance from "./../../service/axiosInstance";
import { API } from "../../service/apiUrl";
import { toast } from "react-toastify";
import Form from "../../components/shared/form/Form";
import Auth_Header from "../../components/layout/header/Auth_Header";
import { useTranslation } from "react-i18next";
import Button from "../../components/shared/Button";
import { handleErrors } from "../../utils/handleError";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/Auth_Context";
const Otp = ({ verifyEmail, onClose, setValue, shouldLogtout }) => {
  const { t } = useTranslation();
  const { email } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { logout } = useAuth();
  //for resend
  const initialTime = parseInt(Cookies.get("otp_timer") || 60, 10);
  const [remainingTime, setRemainingTime] = useState(initialTime);

  const isVerifyAccount = location.pathname.includes("verify-account");
  const title = verifyEmail
    ? "verify_before_email_change"
    : isVerifyAccount
    ? "verify_account_des"
    : "reset_password_by_email";

  // ___________ useform _________
  const {
    control,
    setError,
    reset,
    formState: { errors, isValid },
    handleSubmit,
  } = useForm({
    defaultValues: {
      email: email,
      otp: "",
    },
    mode: "onChange",
  });
  // ______________ function ___________________
  // verify otp
  const onSubmit = async (data) => {
    try {
      setLoading(true);

      if (verifyEmail) {
        data.email = verifyEmail;
      }

      const response = await axiosInstance.post(
        `${API.auth.verify_otp}?forget=${
          isVerifyAccount ? "false" : "true"
        }&change_email=${verifyEmail ? "true" : "false"}`,
        data
      );
      if (response.status === 200) {
        Cookies.remove("otp_timer");
        if (verifyEmail) {
          onClose();
          setValue("email", verifyEmail);
          toast.success(t("email_changed"));
          if (shouldLogtout) {
            logout("/account/login");
          }
        } else {
          if (isVerifyAccount) {
            navigate("/account/login");
          } else {
            navigate(`/account/${email}/reset-password`);
          }
        }
      }
    } catch (err) {
      handleErrors(err, setError, t);
    } finally {
      setLoading(false);
    }
  };

  //resend otp
  const reSendOTP = async () => {
    setRemainingTime(60);
    Cookies.set("otp_timer", 60, { expires: 1 / 1440 });
    try {
      const response = await axiosInstance.post(
        `${API.auth.sendOtp}?change_email=${verifyEmail ? true : false}`,
        {
          email: verifyEmail ? verifyEmail : email,
        }
      );
      if (response.status === 200) {
        toast.success(t("success_send_otp_via_email"));
      }
    } catch (err) {
      handleErrors(err, setError, t);
    }
  };

  useEffect(() => {
    if (remainingTime > 0) {
      const timer = setTimeout(() => {
        setRemainingTime((prevTime) => {
          const newTime = prevTime - 1;
          Cookies.set("otp_timer", newTime, { expires: 1 / 1440 });
          return newTime;
        });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [remainingTime]);

  const renderTime = () => {
    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;
    return (
      <p role="button" className="flex_center gap-1">
        <span className="text-primary-dark">{t("resend_in")}</span>

        <span className="text-primary-dark">
          {`${minutes.toString().padStart(2, "0")}:${seconds
            .toString()
            .padStart(2, "0")}`}
        </span>
      </p>
    );
  };
  // list
  const formList = [
    {
      id: 0,
      formType: "otp",
      fieldName: "otp",
      validator: {
        required: "required_field",
        pattern: {
          value: /^[0-9]+$/,
          message: "must_be_number",
        },
        validate: (value) => {
          return value?.length === 6 || "required_field";
        },
      },
    },
  ];
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-8 justify-center items-center min-h-[50svh] mx-auto"
    >
      <div
        className={`flex flex-col gap-6 lg:gap-12 ${
          verifyEmail ? "max-w-[400px]" : ""
        } `}
      >
        <Auth_Header
          title="verify_account"
          des={title}
          className="text-center"
        />
        <div className="flex flex-col gap-5">
          {!verifyEmail && (
            <p
              className="body_lg text-black font-normal"
              dangerouslySetInnerHTML={{
                __html: `${t(
                  "we_send_code_to"
                )} <strong>${email}</strong> <br/> ${t("check_it")}`,
              }}
            />
          )}
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
          type="secondary"
          loading={loading}
          disabled={loading}
        >
          {t("verify")}
        </Button>
        <p className="text-[#817D85] font-[300] text-sm flex_center_y gap-1 ">
          <span>{t("dont_recive_code")}</span>
          {remainingTime === 0 ? (
            <span
              onClick={reSendOTP}
              className="text-primary-dark cursor-pointer "
            >
              {t("resend")}
            </span>
          ) : (
            renderTime()
          )}
        </p>
      </div>
    </form>
  );
};

export default Otp;
