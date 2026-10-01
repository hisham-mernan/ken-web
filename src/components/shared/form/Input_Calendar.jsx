import React, { useMemo, useRef } from "react";

// lib
import { Skeleton } from "primereact/skeleton";
import { useTranslation } from "react-i18next";
import { Calendar } from "primereact/calendar";
import { addLocale, locale } from "primereact/api";

// utils
import { CalendarIcon } from "../../../assets/icons/Icon";
import { currentLanguageCode } from "../../../utils/switchLang";

// PrimeReact ships English month and day names only, so an Arabic visitor was
// reading "October 2026" and "Sa Fr Th" above an otherwise Arabic form.
// Registered once at module load rather than per render.
addLocale("ar", {
  firstDayOfWeek: 0,
  dayNames: [
    "الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت",
  ],
  dayNamesShort: ["أحد", "إثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت"],
  dayNamesMin: ["أحد", "إثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت"],
  monthNames: [
    "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
    "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر",
  ],
  monthNamesShort: [
    "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
    "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر",
  ],
  today: "اليوم",
  clear: "مسح",
});

const Input_Calendar = ({
  value,
  placeholder,
  error,
  handleChange,
  id,
  loading,
  disabled,
  viewOnly,
  allowedDates,
  stayTimes,
}) => {
  const { t } = useTranslation();
  const calendarRef = useRef();

  // PrimeReact's locale is global, so it is set from the current language each
  // time a calendar mounts rather than once at start-up -- the language can be
  // switched without a reload.
  locale(currentLanguageCode === "ar" ? "ar" : "en");

  // Normalize
  const normalize = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  // Allowed date
  const { allowedSet, disabledDateArray } = useMemo(() => {
    const allowed = new Set();
    const disabled = [];

    allowedDates?.forEach(({ date_from, date_to }) => {
      const [fy, fm, fd] = date_from.split("-").map(Number);
      const [ty, tm, td] = date_to.split("-").map(Number);

      const start = new Date(fy, fm - 1, fd);
      const end = new Date(ty, tm - 1, td);

      if (isNaN(start) || isNaN(end)) return;

      let current = new Date(start);
      while (current <= end) {
        allowed.add(normalize(current));
        current.setDate(current.getDate() + 1);
      }
    });

    // If no allowed dates, disable everything
    if (!allowed.size) {
      const today = new Date();
      const range = 365; // 1 year

      for (let i = -range; i <= range; i++) {
        const day = new Date();
        day.setDate(today.getDate() + i);
        disabled.push(day);
      }

      return { allowedSet: allowed, disabledDateArray: disabled };
    }

    // Disable anything outside allowed ranges
    const sorted = Array.from(allowed)
      .map((d) => new Date(d))
      .sort((a, b) => a - b);
    const min = sorted[0];
    const max = sorted[sorted.length - 1];

    let current = new Date(min);
    while (current <= max) {
      const norm = normalize(current);
      if (!allowed.has(norm)) disabled.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return { allowedSet: allowed, disabledDateArray: disabled };
  }, [allowedDates]);

  const [minDate, maxDate] = useMemo(() => {
    if (!allowedSet.size) return [null, null];
    const sorted = Array.from(allowedSet)
      .map((d) => new Date(d))
      .sort((a, b) => a - b);
    return [sorted[0], sorted[sorted.length - 1]];
  }, [allowedSet]);

  const handleIconClick = () => {
    if (calendarRef.current) calendarRef.current.show();
  };

  // Friday and Saturday, matching products/pricing.py -- those nights are
  // charged at the weekend rate and are the ones that go first.
  const WEEKEND_DAYS = new Set([5, 6]);

  /**
   * Paints each day with what it costs the guest to know.
   *
   * The calendar used to say only "this is greyed out", which left the
   * difference between a night that is gone and a night that is merely dearer
   * invisible until the total changed. Three states, in the brand palette:
   * free, free but a weekend night, and taken.
   */
  const dateTemplate = (date) => {
    const day = new Date(date.year, date.month, date.day);
    const available = allowedSet.has(normalize(day));
    const weekend = WEEKEND_DAYS.has(day.getDay());

    const state = !available
      ? "is_unavailable"
      : weekend
      ? "is_weekend"
      : "is_available";

    return <span className={`calendar_day ${state}`}>{date.day}</span>;
  };

  const legend = (
    <>
      <ul className="calendar_legend">
        <li className="is_available">{t("calendar_available")}</li>
        <li className="is_weekend">{t("calendar_weekend")}</li>
        <li className="is_unavailable">{t("calendar_unavailable")}</li>
      </ul>
      {(stayTimes?.checkIn || stayTimes?.checkOut) && (
        <dl className="calendar_times">
          {stayTimes.checkIn && (
            <div>
              <dt>{t("check_in")}</dt>
              <dd>{stayTimes.checkIn}</dd>
            </div>
          )}
          {stayTimes.checkOut && (
            <div>
              <dt>{t("check_out")}</dt>
              <dd>{stayTimes.checkOut}</dd>
            </div>
          )}
        </dl>
      )}
    </>
  );

  if (loading) {
    return (
      <div className="input_gap">
        <Skeleton width={80} height={15} borderRadius={5} />
        <Skeleton width="100%" height={40} borderRadius={8} />
      </div>
    );
  }

  return (
    <div
      className={`relative input flex_center_y ${disabled ? "disabled" : ""} ${
        error ? "!border-red-dark" : ""
      }`}
    >
      <div
        onClick={() => {
          if (!disabled) {
            handleIconClick();
          }
        }}
        className={!disabled ? "cursor-pointer" : ""}
      >
        <CalendarIcon fill="#292D32" width="24" height="24" />
      </div>

      <Calendar
        value={value}
        ref={calendarRef}
        inputId={id}
        onChange={handleChange}
        placeholder={t(placeholder)}
        disabled={disabled}
        className={`flex-1 !border-none !shadow-none w-full h-full ${
          disabled ? "disabled" : ""
        } ${viewOnly ? "viewonly" : ""}`}
        minDate={minDate}
        maxDate={maxDate}
        disabledDates={disabledDateArray}
        dateFormat="yy-mm-dd"
        dateTemplate={dateTemplate}
        footerTemplate={() => legend}
        panelClassName="ken_calendar_panel"
      />
    </div>
  );
};

export default Input_Calendar;
