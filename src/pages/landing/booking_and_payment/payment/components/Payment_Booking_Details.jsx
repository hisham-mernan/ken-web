import { Skeleton } from "primereact/skeleton";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  ArrowIcon,
  CalendarIcon,
  LongArrowIcon,
  TicketIcon,
  UsersIcon,
} from "../../../../../assets/icons/Icon";
import Button from "../../../../../components/shared/Button";
import { currentLanguageCode } from "../../../../../utils/switchLang";

const Payment_Booking_Details = ({
  title = "booking_details",
  className = "",
  data,
  loading,
}) => {
  const { t } = useTranslation();
  const formateList = [
    {
      id: 0,
      title: "from",
      icons: <CalendarIcon fill="var(--color-primary-dark)" />,
      value: data?.from,
    },
    {
      id: 1,
      title: "to",
      icons: <CalendarIcon fill="var(--color-primary-dark)" />,
      value: data?.to,
    },
    {
      id: 2,
      title: "number_of_guests",
      icons: <UsersIcon fill="var(--color-primary-dark)" />,
      value: `${data?.event_ticket} ${t("tickets")} `,
    },
    {
      id: 3,
      title: "event_ticket",
      icons: <TicketIcon fill="var(--color-primary-dark)" />,
      value: `${data?.event_ticket} ${t("tickets")} `,
    },
  ];
  if (loading) {
    return (
      <Booking_Details_Skeleton
        list={formateList}
        className={className}
        title={title}
      />
    );
  }
  return (
    <div
      className={`${className}  secondary_border ticket_card gap-7  xl:gap-[50px] `}
    >
      <span className=" text-[25px] lg:text-[30px]">{t(title)}</span>
      <ul className="flex flex-col gap-7  xl:gap-[50px] w-full">
        {formateList?.map((item) => (
          <li key={item?.id} className="flex_center_y gap-4 justify-between ">
            <span className="flex w-2/3 md:w-2/4 text-secondary-dark font-semibold capitalize text-base lg:text-lg ">
              {t(item?.title)}:
            </span>
            <div className="flex_center_y gap-1 ">
              {item?.icons}
              <span>{item?.value}</span>
            </div>
          </li>
        ))}

        {/* sub total */}
        <li className="flex_center_y gap-4 justify-between">
          <span className="flex w-2/3 text-primary-dark text-sm font-semibold">
            {t("subtotal")}:
          </span>
          <span className=" text-primary-dark font-extrabold text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl ">
            {data?.subtotal}
          </span>
        </li>
      </ul>
      <Button
        to="/my-booking"
        iconLeft={
          <span className={currentLanguageCode === "en" ? "" : "rotate-180"}>
            <LongArrowIcon fill="var(--color-primary-2)" />
          </span>
        }
        type="outline_primary"
      >
        {t("view_more_details")}
      </Button>
    </div>
  );
};
const Booking_Details_Skeleton = ({ list, className, title }) => {
  const { t } = useTranslation();
  return (
    <div
      className={`${className}  secondary_border ticket_card gap-7  xl:gap-[50px] `}
    >
      <span className=" text-[25px] lg:text-[30px]">{t(title)}</span>
      <ul className="flex flex-col gap-7  xl:gap-[50px] w-full">
        {list?.map((item) => (
          <li key={item?.id} className="flex_center_y gap-4 justify-between ">
            <span className="flex w-2/3 md:w-2/4 text-secondary-dark font-semibold capitalize text-base lg:text-lg ">
              {t(item?.title)}:
            </span>
            <div className="flex_center_y gap-1 ">
              <Skeleton width="80px" height="1rem" />
            </div>
          </li>
        ))}

        {/* sub total */}
        <li className="flex_center_y gap-4 justify-between">
          <span className="flex w-2/3 text-primary-dark text-sm font-semibold">
            {t("subtotal")}:
          </span>
          <span className=" text-primary-dark font-extrabold text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl ">
            <Skeleton width="80px" height="1.5rem" />
          </span>
        </li>
      </ul>
    </div>
  );
};
export default Payment_Booking_Details;
