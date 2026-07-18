import {
  CalendarIcon,
  TicketIcon,
  UsersIcon,
} from "../../../../assets/icons/Icon";
import { currentLanguageCode } from "../../../../utils/switchLang";

const PRIMARY_COLOR = "var(--color-primary-dark)";

const formatOrder = (data) => [
  {
    title: "check_in",
    value: data?.check_in,
    icon: <CalendarIcon fill={PRIMARY_COLOR} />,
  },
  {
    title: "check_out",
    value: data?.check_out,
    icon: <CalendarIcon fill={PRIMARY_COLOR} />,
  },
  {
    title: "number_of_guests",
    value: (data?.persons_max_num ?? 0) + (data?.kids_max_num ?? 0),
    icon: <UsersIcon />,
  },
  {
    title: "event_ticket",
    value: data?.events_tickets_count,
    icon: <TicketIcon />,
  },
];

const formatServices = (services = []) =>
  services.map((item) => ({
    title: currentLanguageCode === "en" ? item?.title : item?.title_ar,
    value: `x${item?.quantity}`,
  }));

const formatExtra = (extraDays = [], extraServices = []) => {
  if (!extraDays.length && !extraServices.length) return "no_extra";

  return {
    title: "Extension",
    data: {
      order: extraDays.flatMap((item) => [
        {
          title: "check_in",
          value: item?.date_from,
          icon: <CalendarIcon fill={PRIMARY_COLOR} />,
        },
        {
          title: "check_out",
          value: item?.date_to,
          icon: <CalendarIcon fill={PRIMARY_COLOR} />,
        },
      ]),
      services: formatServices(extraServices),
    },
  };
};

export const bookingDataFormater = (data) => ({
  booking_details: {
    id: data?.id,
    qr_code_image: data?.qr_code_image,
    title: "booking_details",
    data: {
      order: formatOrder(data),
      services: formatServices(data?.services),
    },
  },
  Extension: formatExtra(data?.extra_days, data?.extra_services),
});
