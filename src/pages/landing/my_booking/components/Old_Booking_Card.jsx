import React from "react";
import { useTranslation } from "react-i18next";
import {
  CalendarIcon,
  TicketIcon,
  UsersIcon,
} from "../../../assets/icons/Icon";
import { Skeleton } from "primereact/skeleton";

const Old_Booking_Card = ({
  title = "booking_details",
  className = "",
  data,
  loading,
  item,
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
      value: `${data?.number_of_guests} ${t("adult")} `,
    },
    {
      id: 3,
      title: "number_of_kids",
      icons: <UsersIcon fill="var(--color-primary-dark)" />,
      value: `${data?.number_of_kids} ${t("kids")} `,
    },
    {
      id: 5,
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
      <span className=" text-[36px] lg:text-[48px]">{t(title)}</span>
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
        {item?.extra_days?.length > 0 && (
          <li className="flex flex-col gap-7">
            <h3 className="text-secondary-dark font-semibold capitalize text-lg lg:text-xl">
              {`${t("extra_days")}:`}
            </h3>
            <ul>
              {item?.extra_days?.map((d) => (
                <ul className="flex flex-col gap-4">
                  <li
                    key={d?.id}
                    className="flex_center_y gap-4 justify-between "
                  >
                    <span className="flex w-2/3 md:w-2/4 text-secondary-dark font-semibold capitalize text-base lg:text-lg ">
                      {t("from")}:
                    </span>
                    <div className="flex_center_y gap-1 ">
                      <CalendarIcon fill="var(--color-primary-dark)" />
                      <span>{d?.date_from}</span>
                    </div>
                  </li>
                  <li
                    key={d?.id}
                    className="flex_center_y gap-4 justify-between "
                  >
                    <span className="flex w-2/3 md:w-2/4 text-secondary-dark font-semibold capitalize text-base lg:text-lg ">
                      {t("to")}:
                    </span>
                    <div className="flex_center_y gap-1 ">
                      <CalendarIcon fill="var(--color-primary-dark)" />
                      <span>{d?.date_to}</span>
                    </div>
                  </li>
                </ul>
              ))}
            </ul>
          </li>
        )}
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
    </div>
  );
};
const Booking_Details_Skeleton = ({ list, className, title }) => {
  const { t } = useTranslation();
  return (
    <div
      className={`${className}  secondary_border ticket_card gap-7  xl:gap-[50px] `}
    >
      <span className=" text-[36px] lg:text-[48px]">{t(title)}</span>
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
export default Old_Booking_Card;
