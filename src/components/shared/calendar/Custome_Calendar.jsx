import React from "react";
import { LinearArrowIcon } from "../../../assets/icons/Icon";
import Modal from "../popup/Modal";
import { useTranslation } from "react-i18next";
import { currentLanguageCode } from "../../../utils/switchLang";

const daysEN = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const daysAR = [
  "الأحد",
  "الإثنين",
  "الثلاثاء",
  "الأربعاء",
  "الخميس",
  "الجمعة",
  "السبت",
];

const generateCalendar = (month, year) => {
  const firstDay = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const calendar = [];
  let week = Array(firstDay).fill("");

  for (let day = 1; day <= daysInMonth; day++) {
    week.push(day.toString());
    if (week.length === 7) {
      calendar.push(week);
      week = [];
    }
  }

  while (week.length < 7) week.push("");
  calendar.push(week);

  return calendar;
};

const getDatesBetween = (startDate, endDate) => {
  const dates = [];
  let current = new Date(startDate);
  while (current <= endDate) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return dates;
};

const Custome_Calendar = ({
  open,
  onClose,
  year,
  month,
  available_dates = [],
}) => {
  const { t } = useTranslation();
  const today = new Date();

  const [displayMonth, setDisplayMonth] = React.useState(
    month || today.getMonth() + 1
  );
  const [displayYear, setDisplayYear] = React.useState(
    year || today.getFullYear()
  );

  const days = currentLanguageCode === "en" ? daysEN : daysAR;

  const monthDate = new Date(displayYear, displayMonth - 1);
  const monthName = monthDate.toLocaleString(currentLanguageCode, {
    month: "long",
  });

  const availableDays = available_dates
    .flatMap(({ date_from, date_to }) => {
      const start = new Date(date_from);
      const end = new Date(date_to);
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);
      const clampedStart =
        start < new Date(today.getFullYear(), today.getMonth(), today.getDate())
          ? new Date(today.getFullYear(), today.getMonth(), today.getDate())
          : start;

      const clampedEnd =
        end > new Date(displayYear, displayMonth, 0)
          ? new Date(displayYear, displayMonth, 0)
          : end;

      if (
        clampedEnd.getFullYear() === displayYear &&
        clampedEnd.getMonth() + 1 === displayMonth
      ) {
        return getDatesBetween(clampedStart, clampedEnd)
          .filter(
            (d) =>
              d.getFullYear() === displayYear &&
              d.getMonth() + 1 === displayMonth &&
              d >=
                new Date(today.getFullYear(), today.getMonth(), today.getDate())
          )
          .map((d) => d.getDate());
      }

      return [];
    })
    .sort((a, b) => a - b);

  const rangeStart = availableDays.length > 0 ? availableDays[0] : null;
  const rangeEnd =
    availableDays.length > 0 ? availableDays[availableDays.length - 1] : null;

  const rangeStartDate = rangeStart
    ? new Date(displayYear, displayMonth - 1, rangeStart)
    : null;
  const rangeEndDate = rangeEnd
    ? new Date(displayYear, displayMonth - 1, rangeEnd)
    : null;

  const calendarGrid = generateCalendar(displayMonth, displayYear);

  const isPrevDisabled =
    displayYear < today.getFullYear() ||
    (displayYear === today.getFullYear() &&
      displayMonth <= today.getMonth() + 1);

  const goToPreviousMonth = () => {
    if (isPrevDisabled) return;
    if (displayMonth === 1) {
      setDisplayMonth(12);
      setDisplayYear(displayYear - 1);
    } else {
      setDisplayMonth(displayMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (displayMonth === 12) {
      setDisplayMonth(1);
      setDisplayYear(displayYear + 1);
    } else {
      setDisplayMonth(displayMonth + 1);
    }
  };

  const getAvailableDateMessage = () => {
    if (!rangeStartDate || !rangeEndDate) return t("no_availability");

    const displayMonthStart = new Date(displayYear, displayMonth - 1, 1);
    const displayMonthEnd = new Date(displayYear, displayMonth, 0);

    const isInCurrentMonth =
      rangeStartDate <= displayMonthEnd && rangeEndDate >= displayMonthStart;

    if (isInCurrentMonth) return t("available_this_month");

    const startString = rangeStartDate.toLocaleDateString(currentLanguageCode, {
      day: "numeric",
      month: "short",
    });

    const endString = rangeEndDate.toLocaleDateString(currentLanguageCode, {
      day: "numeric",
      month: "short",
    });

    return `${t("available_from")} ${startString} ${t("to")} ${endString}`;
  };

  const getDayClasses = (day) => {
    if (!day) return "";

    const base = "w-9 h-9 flex items-center justify-center mx-auto";
    const dayNum = parseInt(day);
    if (isNaN(dayNum)) return base;

    const dayDate = new Date(displayYear, displayMonth - 1, dayNum);

    if (
      dayDate < new Date(today.getFullYear(), today.getMonth(), today.getDate())
    ) {
      return `${base} text-gray-300 cursor-default`;
    }

    if (!availableDays.includes(dayNum)) {
      return `${base} text-[#6A6A6D]`;
    }

    if (dayNum === rangeStart && dayNum === rangeEnd) {
      return `${base} !mx-0 rounded-full !w-9 !h-9 w-full bg-[#b7a999] text-white`;
    }
    if (dayNum === rangeStart) {
      return `${base} !mx-0 w-full ${
        currentLanguageCode === "en" ? "rounded-l-full" : "rounded-r-full"
      } bg-[#b7a999] text-white`;
    }
    if (dayNum === rangeEnd) {
      return `${base} !mx-0 w-full ${
        currentLanguageCode === "en" ? "rounded-r-full" : "rounded-l-full"
      } bg-[#b7a999] text-white`;
    }
    if (dayNum > rangeStart && dayNum < rangeEnd) {
      return `${base} w-full h-9 !mx-0 bg-[#d6cbbf] text-[#6A6A6D]`;
    }

    return `${base} text-[#6A6A6D]`;
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      className="!w-[375px] no_padding hide_header clanedar_modal rounded-2xl"
    >
      <section className="w-full pt-3 pb-8 px-8">
        <div className="w-full bg-white">
          <header className="mb-4 flex flex-col">
            <div className="flex justify-between items-center">
              <span
                className={`cursor-pointer ${
                  currentLanguageCode === "en" ? "rotate-180" : ""
                } ${isPrevDisabled ? "opacity-40 cursor-not-allowed" : ""}`}
                onClick={goToPreviousMonth}
              >
                <LinearArrowIcon />
              </span>
              <h2 className="text-lg text-text-primary">
                {monthName} {displayYear}
              </h2>
              <span
                className={`cursor-pointer ${
                  currentLanguageCode === "en" ? "" : "rotate-180"
                }`}
                onClick={goToNextMonth}
              >
                <LinearArrowIcon />
              </span>
            </div>
            <p className="text-xs text-grey-color text-center ">
              {getAvailableDateMessage()}
            </p>
          </header>

          <div className="grid grid-cols-7 text-xs text-center text-[#D5D5D6] mb-2">
            {days.map((day) => (
              <div key={day} className="font-medium">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-y-1 text-sm text-center">
            {calendarGrid.flat().map((day, i) => (
              <div key={i} className={getDayClasses(day)}>
                {day}
              </div>
            ))}
          </div>
        </div>
      </section>
    </Modal>
  );
};

export default Custome_Calendar;
