export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// export const saudiPhoneNumberRegex =
//   /^(9665|05|5)(5|0|3|6|4|9|1|8|7)([0-9]{7})$/;

export const saudiPhoneNumberRegex = /^\d{9}$/;

export const passwordPattern = /^.{6,}$/;
export const genericNationalIdPattern = /^[A-Za-z0-9]{8,16}$/;

export const nameValidationPattern = /^[A-Za-z\s.]{2,}$/;

export const cardNumberValidationPattern = /^\d{13,19}$/;

export const cvvValidationPattern = /^\d{3}$/;

export const namePattern = /^[a-zA-Z\u0600-\u06FF\s]{2,}$/;

export const isRangeAvailable = (from, to, availableDates) => {
  const msPerDay = 1000 * 60 * 60 * 24;

  const fromDate = new Date(from);
  const toDate = new Date(to);

  fromDate.setHours(0, 0, 0, 0);
  toDate.setHours(0, 0, 0, 0);

  for (
    let d = new Date(fromDate);
    d < toDate;
    d = new Date(d.getTime() + msPerDay)
  ) {
    const isCovered = availableDates.some((range) => {
      const start = new Date(range.date_from);
      const end = new Date(range.date_to);

      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);

      return d >= start && d <= end;
    });

    if (!isCovered) return false;
  }

  return true;
};
