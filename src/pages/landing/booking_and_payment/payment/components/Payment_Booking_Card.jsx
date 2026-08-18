import React, { useState } from "react";

// lib

import { useTranslation } from "react-i18next";
import { SHOW_EVENTS, SHOW_SERVICES } from "../../../../../config/features";

// components

// utils
import { currentLanguageCode } from "../../../../../utils/switchLang";

// assets
import {
  CalendarIcon,
  CopyIcon,
  UsersIcon,
} from "../../../../../assets/icons/Icon";
import Form from "../../../../../components/shared/form/Form";

const Payment_Booking_Card = ({
  data,
  loading,
  errors,
  control,
  setError,
  dataLoader,
}) => {
  const { t } = useTranslation();

  // ____________ list __________________
  const formList = [
    {
      id: 0,
      formType: "input",
      fieldName: "date_from",
      label: "from",
      name: "from",
      placeholder: `5-5-${new Date().getFullYear()}`,
      icon: <CalendarIcon fill="var(--color-icon)" width="24" height="24" />,
      disabled: true,

      className: "col-span-1 lg:col-span-2",
    },
    {
      id: 1,
      formType: "input",
      fieldName: "date_to",
      label: "to",
      name: "to",
      placeholder: `5-5-${new Date().getFullYear()}`,
      icon: <CalendarIcon fill="var(--color-icon)" width="24" height="24" />,
      disabled: true,
      className: "col-span-1 lg:col-span-2",
    },
    {
      id: 50,
      formType: "label_groups",
      label: "number_of_guests",
      className: "col-span-1 lg:col-span-2",
    },
    {
      id: 2,
      formType: "input",
      fieldName: "persons_max_num",
      name: "number_of_guests",

      placeholder: `2 ${t("adults")}`,
      type: "number",

      icon: <UsersIcon />,
      disabled: true,
    },
    {
      id: 3,
      formType: "input",
      fieldName: "kids_max_num",
      name: "kids",

      placeholder: `2 ${t("kids")}`,
      type: "number",

      icon: <UsersIcon />,
      disabled: true,
    },
  ];
  const eventList = [
    {
      id: 5,
      formType: "input",
      fieldName: "events_tickets_count",
      name: "events_tickets_count",
      label: "tickets",
      value: `${data?.events_tickets_count} ${t("tickets_for_event")}`,
      disabled: true,
      icon: <CopyIcon />,
    },
  ];

  return (
    <div className="secondary_border form_p flex flex-col gap-[50px] ">
      <h2 className="font-creattion-demo text-[48px] text-primary-2 leading-4 ">
        {t("booking_details")}
      </h2>
      <div className="flex flex-col gap-8 md:gap-10 lg:gap-[50px]">
        <div className="flex flex-col gap-4 lg:gap-6">
          <h3 className="text-secondary font-bold text-lg md:text-xl">
            {" "}
            {t("main_details")}
          </h3>
          <fieldset className="grid lg:grid-cols-2 gap-4 lg:gap-6">
            <Form
              formList={formList}
              viewOnly={true}
              control={control}
              errors={errors}
              loading={loading}
              setError={setError}
              dataLoader={dataLoader}
            />
          </fieldset>
        </div>
        {/* for events */}
        {SHOW_EVENTS && (
          <div className="flex flex-col gap-4 lg:gap-6">
            <h3 className="text-secondary font-bold text-lg md:text-xl">
              {" "}
              {t("tickets_for_event")}
            </h3>
            <Form
              formList={eventList}
              viewOnly={true}
              control={control}
              errors={errors}
              loading={loading}
              setError={setError}
              dataLoader={dataLoader}
            />
          </div>
        )}
        {/* end for events */}
        {/* start extra service */}
        {SHOW_SERVICES && data?.services?.length > 0 && (
          <div className="flex flex-col gap-4 lg:gap-6">
            <h3 className="text-secondary font-bold text-lg md:text-xl">
              {" "}
              {t("extra_services")}
            </h3>
            <div className="flex flex-col gap-6">
              {data?.services?.map((item) => (
                <div
                  key={item?.id}
                  className="flex_center_y gap-2 justify-between"
                >
                  <p className="flex-1 text-secondary-dark font-semibold text-base md:text-lg lg:text-xl">
                    {currentLanguageCode === "en"
                      ? item?.title
                      : item?.title_ar}
                  </p>
                  {/* <button
                  disabled={loading}
                  onClick={() => handleToggleService(item?.id)}
                  className={`w-[30px] h-[30px] rounded-sm outline-none shadow-none flex_center bg-[#A5938199] ${
                    loading ? "" : "cursor-pointer"
                  } `}
                >
                  <TrashIcon />
                </button> */}
                </div>
              ))}
            </div>
          </div>
        )}
        {/* end extra service */}
        {/* total */}
        <div className="text-primary-dark flex_center_y justify-between gap-2">
          <span className="text-sm font-semibold">{t("subtotal")}</span>
          <strong className=" text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl">
            {data?.total_price}
          </strong>
        </div>
      </div>
    </div>
  );
};

export default Payment_Booking_Card;
