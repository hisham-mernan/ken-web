import React, { useEffect, useState } from "react";

// lib
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

// components
import Branded_Section from "../Branded_Section";

// utils
import { handleErrors } from "../../../utils/handleError";
import axiosInstance from "../../../service/axiosInstance";
import { API } from "../../../service/apiUrl";
import { toast } from "react-toastify";
import { emailRegex, namePattern } from "../../../utils/validator";
import {
  DocumentIcon,
  EmailIcon,
  UserIcon,
  UserOctagonIcon,
} from "../../../assets/icons/Icon";
import Form from "../form/Form";
import Button from "../Button";
import { getUserRole } from "../../../utils/auth";
const { email } = getUserRole();
const Support = () => {
  const { t } = useTranslation();
  const isContactPage = location.pathname.includes("contact");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  // ___________ useform _________
  const {
    control,
    setError,
    reset,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      full_name: "",
      email: email ?? "",
      content: "",
      is_admin: isContactPage ? false : true,
    },
    mode: "onChange",
  });
  // ____________ function __________________
  const getSuppliers = async () => {
    try {
      setLoadingData(true);
      const response = await axiosInstance.get(API.list.suppliers);

      if (response.status === 200) {
        setData(response.data ?? []);
      }
    } catch (err) {
      console.log("Error while getting suppliers");
    } finally {
      setLoadingData(false);
    }
  };
  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const response = await axiosInstance.post(API.support, data);
      if (response.status === 201) {
        reset();
        toast.success(t("successfully_send_message"));
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
      id: 0,
      formType: "input",
      fieldName: "full_name",
      name: "name",
      type: "text",
      label: isContactPage ? "sender" : "name",
      placeholder: "name_placeholder",
      validator: {
        required: "required_field",
        pattern: {
          value: namePattern,
          message: "invalid_name",
        },
        maxLength: {
          value: 50,
          message: `${t("max_value", { value: 50 })}`,
        },
      },
      icon: <UserIcon />,
      hasRequiredStar: true,

      inputClassName: "!bg-white placeholder:!text-secondary-light",
      labelClassName: "!text-secondary-light",
    },
    isContactPage && {
      id: 1,
      formType: "dropdown",
      fieldName: "operation",
      name: "name",
      type: "text",
      label: "receiver",
      placeholder: "ken_operation",
      validator: {
        required: "required_field",
      },
      optionList: data?.map((item) => ({
        name: item?.email,
        value: item?.id,
      })),
      hasFilter: true,
      icon: <UserOctagonIcon />,
      hasRequiredStar: true,

      inputClassName: "!bg-white secondary_text",
      labelClassName: "!text-secondary-light",
    },
    {
      id: 2,
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

      inputClassName: "!bg-white placeholder:!text-secondary-light",
      labelClassName: "!text-secondary-light",
    },
    {
      id: 3,
      formType: "textarea",
      fieldName: "content",
      label: "your_message",
      placeholder: "your_message",
      validator: {
        required: "required_field",
        maxLength: {
          value: 500,
          message: `${t("max_value", { value: 500 })}`,
        },
      },
      icon: <DocumentIcon />,
      hasRequiredStar: true,

      inputClassName: "!bg-white placeholder:!text-secondary-light",
      labelClassName: "!text-secondary-light",
    },
  ];

  useEffect(() => {
    if (isContactPage) {
      getSuppliers();
    }
  }, []);
  return (
    <Branded_Section className="!py-20  sm:!py-28 lg:!py-[90px]  ">
      {" "}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className=" w-full px-4  max-w-[630px]  mx-auto flex flex-col items-center gap-10"
      >
        <div className="w-full flex flex-col gap-6">
          <Form
            formList={formList}
            control={control}
            errors={errors}
            loading={loading}
            setError={setError}
          />
        </div>
        <Button role="submit" rounded="full" loading={loading}>
          {t("send_message")}
        </Button>
      </form>
    </Branded_Section>
  );
};

export default Support;
