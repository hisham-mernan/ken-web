import React, { useMemo, useRef } from "react";

// lib
import { Skeleton } from "primereact/skeleton";
import { useTranslation } from "react-i18next";
import { Calendar } from "primereact/calendar";

// utils
import { CalendarIcon } from "../../../assets/icons/Icon";

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
}) => {
  const { t } = useTranslation();
  const calendarRef = useRef();

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
      />
    </div>
  );
};

export default Input_Calendar;
