import {
  CalendarIcon,
  TicketIcon,
  UsersIcon,
} from "../../../../assets/icons/Icon";
import { currentLanguageCode } from "../../../../utils/switchLang";
import { SHOW_EVENTS, SHOW_SERVICES } from "../../../../config/features";

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
  // Event ticket row is dropped while events are hidden.
  ...(SHOW_EVENTS
    ? [
        {
          title: "event_ticket",
          value: data?.events_tickets_count,
          icon: <TicketIcon />,
        },
      ]
    : []),
];

const formatServices = (services = []) =>
  services.map((item) => ({
    title: currentLanguageCode === "en" ? item?.title : item?.title_ar,
    value: `x${item?.quantity}`,
  }));

const formatExtra = (extraDays = [], extraServices = []) => {
  // Extra services are hidden, so an extension of services alone shows nothing.
  const services = SHOW_SERVICES ? extraServices : [];
  if (!extraDays.length && !services.length) return "no_extra";

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
      services: formatServices(services),
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
      services: SHOW_SERVICES ? formatServices(data?.services) : [],
    },
  },
  Extension: formatExtra(data?.extra_days, data?.extra_services),
});
