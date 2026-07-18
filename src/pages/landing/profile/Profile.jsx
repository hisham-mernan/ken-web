import React, { useEffect, useState } from "react";

import useGetData from "../../../hooks/useGetData";
import { API } from "../../../service/apiUrl";

import { useTranslation } from "react-i18next";
import Landing_Header from "../../../components/layout/header/Landing_Header";
import {
  ProfilePersonalInfoImg,
  ProfileSecurityImg,
} from "../../../assets/images/Image";
import {
  emailRegex,
  genericNationalIdPattern,
  passwordPattern,
  saudiPhoneNumberRegex,
} from "../../../utils/validator";
import { BurgerIcon, Key2Icon } from "../../../assets/icons/Icon";
import { useForm } from "react-hook-form";
import axiosInstance from "../../../service/axiosInstance";
import { toast } from "react-toastify";
import { handleErrors } from "../../../utils/handleError";
import Form from "../../../components/shared/form/Form";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../../../context/Auth_Context";
import Cookies from "js-cookie";
import Modal from "../../../components/shared/popup/Modal";
import Otp from "../../auth/Otp";
import Button from "../../../components/shared/Button";
import Profile_Badge from "./Profile_Badge";

const Profile = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [loadingOtp, setLoadingOtp] = useState(false);
  const [newEmail, setNewEmail] = useState();
  const [logoutUser, setLogoutUser] = useState(false);
  const { logout } = useAuth();
  // verify otp when user change email
  const [visible, setVisible] = useState(false);
  const [searchParam, setSearchParam] = useSearchParams();
  const isFromEmail = searchParam.get("is_email");
  const {
    control,
    setError,
    reset,
    watch,
    setValue,
    getValues,
    formState: { errors, dirtyFields, isDirty },
    handleSubmit,
  } = useForm({
    defaultValues: {
      email: null,
      password: null,
      confirm_password: null,
      full_name: "",
      id_num: "",
      avatar: null,
      phone: null,
    },
    mode: "onChange",
  });
  const setDefaultValues = (data) => {
    if (!data) return;

    const values = {};

    Object.entries(data).forEach(([key, value]) => {
      if (key === "phone") {
        values.phone = value?.slice(4);
      } else {
        values[key] = value;
      }
    });

    reset(values);
  };
  const { data, loading: loadingData } = useGetData(
    API.profile.get,
    setDefaultValues
  );

  // list
  const imageList = [
    {
      id: 1,
      formType: "image",
      fieldName: "avatar",
    },
  ];
  const personalInfoFormList = [
    {
      id: 2,
      formType: "input",
      fieldName: "full_name",
      label: "full_name",
      name: "full_name",
      placeholder: "full_name_placeholder",
      validator: {
        required: "required_field",
        maxLength: {
          value: 50,
          message: `${t("max_length_error", { length: 50 })}`,
        },
      },
      inputContainerClassName: "bg-white border border-[#C9A96E33]!",
      icon: <span>&#128522;</span>,
      hasRequiredStar: true,
    },
    {
      id: 3,
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
      inputContainerClassName: "bg-white border border-[#C9A96E33]!",

      icon: <BurgerIcon fill="#BBBEBD" />,
      hasRequiredStar: true,
    },

    {
      id: 4,
      formType: "phone_number",
      fieldName: "phone",

      label: "phone_number",
      placeholder: "XXX XXX XXX",
      validator: {
        required: "required_field",
        pattern: {
          value: saudiPhoneNumberRegex,
          message: "invalid_phone_number",
        },
      },
      inputContainerClassName: "bg-white border border-[#C9A96E33]! ",
      className: "lg:col-span-2",
      hasRequiredStar: true,
    },
  ];

  const securityFormList = [
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
      inputContainerClassName: "bg-white border border-[#C9A96E33]!",
      className: "lg:col-span-2",

      icon: <span>✉</span>,
      hasRequiredStar: true,
    },

    {
      id: 2,
      formType: "input",
      type: "password",
      fieldName: "password",
      label: "password",
      placeholder: "password",
      validator: {
        pattern: {
          value: passwordPattern,
          message: "wrong_password",
        },
      },
      icon: <Key2Icon />,
      showForgetPassword: false,
      hasRequiredStar: true,
      inputContainerClassName: "bg-white border border-[#C9A96E33]!",
    },
    {
      id: 6,
      formType: "input",
      type: "password",
      fieldName: "confirm_password",
      validator: {
        validate: (value) => {
          const password = getValues("password");
          if (value && !password) {
            setError("password", {
              message: "required_field",
            });
          }
          return value === password || "password_mismatch";
        },
      },
      placeholder: "confirm_password_placeholder",
      label: "confirm_password",
      showForgetPassword: false,
      hasRequiredStar: true,
      inputContainerClassName: "bg-white border border-[#C9A96E33]!",

      icon: <Key2Icon />,
    },
  ];
  const profileStat = [
    { id: 1, value: 12, label: "bookings" },
    { id: 2, value: 3, label: "reviews" },
    { id: 3, value: "gold", label: "tier" },
  ];
  const profileList = [
    {
      id: 1,
      title: "personal_info",
      headerImg: ProfilePersonalInfoImg,
      form: personalInfoFormList,
    },
    {
      id: 2,
      title: "security",
      headerImg: ProfileSecurityImg,
      form: securityFormList,
    },
  ];

  // ____________ function __________________
  // send otp will work when user try to verify email
  const reSendOTP = async (email) => {
    Cookies.set("otp_timer", 60, { expires: 1 / 1440 });
    try {
      setLoadingOtp(true);
      const response = await axiosInstance.post(
        `${API.auth.sendOtp}?change_email=true`,
        {
          email: email,
        }
      );
      if (response.status === 200) {
        setVisible(true);
      }
    } catch (err) {
      handleErrors(err, setError, t);
    } finally {
      setLoadingOtp(false);
    }
  };
  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const formData = new FormData();
      const loopData = Object.keys(dirtyFields).reduce((acc, key) => {
        acc[key] = data[key];
        return acc;
      }, {});

      console.log(loopData, "load data");
      Object.entries(loopData).forEach(([key, value]) => {
        if (value === "" || value == null) return;

        if (key === "avatar" && value instanceof File) {
          formData.append("avatar", value);
        } else if (key === "phone") {
          const formattedPhone = value.startsWith("+966")
            ? value
            : `+966${value}`;
          formData.append("phone", formattedPhone);
        } else {
          formData.append(key, value);
        }
      });
      // for (let [key, value] of formData.entries()) {
      //   console.log(`${key}:`, value);
      // }
      const response = await axiosInstance.put(API.profile.get, formData);

      if (response.status === 200) {
        if (loopData.password && !loopData.email) {
          toast.success(t("password_changed"));
          logout("/account/login");
        } else if (loopData.email) {
          setNewEmail(data.email);

          reSendOTP(data?.email);
          if (loopData.password) {
            setLogoutUser(true);
          }
        } else {
          toast.success(t("profile_updated"));
        }
      }
    } catch (err) {
      console.error("Profile update error:", err);
      handleErrors(err, setError, t);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFromEmail === "true") {
      setVisible(true);
      setNewEmail(searchParam.get("email"));
      const newParam = new URLSearchParams(searchParam);
      newParam.delete("is_email");
      newParam.delete("email");
      setSearchParam(newParam);
    }
  }, [isFromEmail]);
  return (
    <section className=" Container page_p flex flex-col gap-5 sm:gap-8 lg:gap-[62px] pb-[78px] ">
      <Landing_Header title="my_profile" />
      <Profile_Badge />
      <section className=" ">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="shadow_primary border border-[#C9A96E40] rounded-[20px] bg-[#FDFBF7] p-4 sm:p-8 md:p-6 lg:p-10 xl:px-16 xl:py-12  "
        >
          <header className=" pb-12 flex items-center justify-between gap-8">
            <Form
              formList={imageList}
              control={control}
              errors={errors}
              loading={loading}
              setError={setError}
              skeleton={loadingData}
            />
            <div className={`flex-1 flex flex-col gap-1`}>
              <h1 className="font-bold text-[28px] truncate">
                {data?.full_name}
              </h1>
              <span className="text-[#999999] text-sm">
                {t("join_since", { year: 2024 })}
              </span>
            </div>
            <div className="flex items-baseline justify-between gap-10">
              {profileStat?.map((item) => (
                <div
                  key={item?.id}
                  className={`flex flex-col gap-0.5 items-center justify-center text-center`}
                >
                  <strong className="text-[#393C20] text-xl lg:text-2xl">
                    {t(item?.value)}
                  </strong>
                  <span className="text-[#999999] text-xs uppercase tracking-[1px]">
                    {t(item?.label)}
                  </span>
                </div>
              ))}
            </div>
          </header>
          {profileList?.map((item, index) => (
            <div key={item?.id}>
              <section className="flex flex-col gap-4 sm:gap-6 lg:gap-7 py-8">
                <header className="flex items-center gap-3">
                  <img src={item?.headerImg} className="w-9 h-9 rounded-full" />
                  <h3 className="text-main-dark  font-bold text-lg">
                    {t(item?.title)}
                  </h3>
                </header>
                <fieldset className="grid md:grid-cols-2 gap-2  lg:gap-6">
                  <Form
                    formList={item?.form}
                    control={control}
                    errors={errors}
                    loading={loading}
                    setError={setError}
                    skeleton={loadingData}
                  />
                </fieldset>
              </section>
              {index < profileList?.length - 1 && (
                <div className="w-full h-[1px]  bg-[#C9A96E40]" />
              )}
            </div>
          ))}
          <footer className="flex justify-end items-center gap-4">
            <Button
              className="min-[123px]! w-fit! h-12! bg-transparent! border-[#C9A96E26]!"
              type="outline"
              disabled={!isDirty}
              onClick={() => {
                reset(data);
              }}
            >
              {t("cancel")}
            </Button>
            <Button
              disabled={!isDirty || loadingData}
              role="submit"
              loading={loading}
              className="!rounded-lg w-fit! min-w-[205px]! h-12!"
            >
              {t("save_changes")}
            </Button>
          </footer>
          {/* <Personal_Data personalData={data} loadingData={loading} /> */}
          {/* <Security personalData={data} loadingData={loading} /> */}
        </form>
      </section>

      <Modal open={visible} onClose={() => setVisible(false)}>
        <Otp
          verifyEmail={newEmail}
          setValue={setValue}
          onClose={() => setVisible(false)}
          shouldLogtout={logoutUser}
        />
      </Modal>
    </section>
  );
};

export default Profile;
