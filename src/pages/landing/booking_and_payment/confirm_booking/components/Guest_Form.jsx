import React, { useState } from "react";
import Modal from "../../../../../components/shared/popup/Modal";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import axiosInstance from "../../../../../service/axiosInstance";
import { handleErrors } from "../../../../../utils/handleError";
import { API } from "../../../../../service/apiUrl";
import {
  emailRegex,
  namePattern,
  saudiPhoneNumberRegex,
} from "../../../../../utils/validator";
import { EmailIcon, UserIcon } from "../../../../../assets/icons/Icon";
import Form from "../../../../../components/shared/form/Form";
import Button from "../../../../../components/shared/Button";
import { Link } from "react-router-dom";

const Guest_Form = ({ open, onClose }) => {
  const { t } = useTranslation();
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
      full_name: "",

      email: "",
      phone: null,
    },
    mode: "onChange",
  });
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
  ];
  // ____________ function __________________
  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const response = await axiosInstance.post(API.booking.confirm.guest, {
        ...data,
        phone: `+966${data?.phone}`,
      });
    } catch (err) {
      handleErrors(err, setError, t);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Modal open={open} onClose={onClose} hide_close={true}>
      <form className="max-w-[550px] pt-8 w-full mx-auto flex flex-col gap-6 md:gap-[46px] ">
        <header className="flex flex-col gap-2.5">
          <h3 className="display_sm text-main-dark">{t("guest_form_title")}</h3>
          <p className="title_lg text-main-dark">{t("guest_form_des")}</p>
        </header>
        <div className="flex flex-col gap-4 md:gap-[22px]">
          <Form
            formList={formList}
            control={control}
            errors={errors}
            loading={loading}
            setError={setError}
          />
        </div>
        <footer className="flex flex-col gap-4 md:gap-8">
          <Button
            role="submit"
            type="secondary"
            loading={loading}
            disabled={loading}
          >
            {t("sign_up")}
          </Button>

          <p className="text-[#817D85] font-[300] text-sm flex_center_y gap-1 ">
            <span>{t("have_an_account")}</span>
            <Link className="text-primary-dark" to="/account/login">
              {t("login")}
            </Link>
          </p>
        </footer>
      </form>
    </Modal>
  );
};

export default Guest_Form;
