import { toast } from "react-toastify";

export const handleErrors = (err, setError, t, navigate, item) => {
  if (!err || !err.response || !err.response.data) {
    toast.error(t("unexpected_error"));
    return;
  }

  const data = err.response.data;

  if (typeof data === "string" && data.includes("<!DOCTYPE html>")) {
    toast.error(t("unexpected_error"));
    return;
  }
  // error related to auth flows
  if (data?.phone?.includes("The phone number entered is not valid.")) {
    setError("phone", {
      type: "manual",
      message: "invalid_phone_number",
    });
  }
  if (data?.email?.includes("Email is already in use.")) {
    toast.error(t("email_already_exist"));
    setError("email", {
      type: "manual",
      message: t("email_already_exist"),
    });
    return;
  }

  if (data?.error?.includes("is not available for this hut")) {
    toast.error(data?.error);
    setError("date_from", {
      type: "manual",
      message: data?.error,
    });
    setError("date_to", {
      type: "manual",
      message: data?.error,
    });
    return;
  }
  if (
    Array.isArray(data) &&
    data[0]?.includes("is not available for the selected hut.")
  ) {
    const match = data[0].match(
      /The date from\s*(\d{4}-\d{2}-\d{2})\s*to\s*(\d{4}-\d{2}-\d{2})\s*is not available/
    );
    const from = match?.[1] || "";
    const to = match?.[2] || "";

    toast.error(t("date_range_not_available", { from, to }));
    return;
  }

  // The backend spells it "verified"; this used to look for "verfied" and so
  // never matched, dropping unverified users into the generic error instead
  // of the OTP screen. Both spellings are accepted now.
  if (
    data?.non_field_errors?.some((e) =>
      /This user is not ver(i)?fied/.test(e)
    )
  ) {
    toast.error(t("unverified_account"));
    navigate(`/account/${item}/verify-account`);
    return;
  }
  if (data?.non_field_errors?.at(0)?.includes("Hut not available on")) {
    toast.error(data?.non_field_errors?.at(0));

    return;
  }
  if (
    data?.detail?.includes("No user found with email") ||
    data?.error?.includes("No user found with email")
  ) {
    toast.error(t("email_not_found"));
    return;
  }

  const getFirstError = (val) => {
    if (!val) return null;
    if (Array.isArray(val)) return val[0];
    if (typeof val === "string") return val;
    return null;
  };

  const detail =
    data.detail ||
    data.message ||
    data.error ||
    getFirstError(data?.phone) ||
    getFirstError(data?.email) ||
    getFirstError(data?.password) ||
    getFirstError(data?.id_num) ||
    getFirstError(data?.promocode) ||
    getFirstError(data?.non_field_errors);
  if (
    detail?.includes("Cannot cancel booking less than 2 days before start date")
  ) {
    toast.error(t("cancel_booking_restriction"));
    return;
  }
  if (detail.includes("Service 'Services object")) {
    toast.error(detail);
    return;
  }
  switch (detail) {
    case "Password is not correct.":
      toast.error(t("invalid_email_password"));
      setError("email", {
        type: "manual",
        message: "invalid_email_password",
      });
      setError("password", {
        type: "manual",
        message: "invalid_email_password",
      });
      return;
    case "User with this email does not exist.":
      toast.error(t("user_not_found"));
      return;
    case "No User matches the given query.":
    case "User not found.":
    case "User not found":
      toast.error(t("user_not_found"));
      return;
    case "You are not permitted to change password. please go to verfiy your otp":
      toast.error(t("not_allowed_to_change_password"));
      navigate(`/account/forget-password`);
      return;
    case "Invalid verification code":
    case "Invalid verification code.":
      toast.error(t("invalid_otp"));
      setError("otp", {
        type: "manual",
        message: t("invalid_otp"),
      });
      return;
    case "expired verification code":
    case "Verification code has expired.":
      toast.error(t("expire_otp"));
      setError("otp", {
        type: "manual",
        message: t("expire_otp"),
      });
      return;
    case " id_num  is already  exsit":
      toast.error(t("national_id_exist"));
      setError("id_num", {
        type: "manual",
        message: t("national_id_exist"),
      });
      return;
    case "Phone number is already in use.":
      toast.error(t("phone_numbe_already_exist"));
      setError("phone", {
        type: "manual",
        message: t("phone_numbe_already_exist"),
      });
      return;

    case "No Order matches the given query.":
      toast.error(t("order_not_found"));
      return null;
    case "You do not have permission to perform this action.":
      toast.error(t("not_allow_to_preform_action"));
      return;
    case "No Hut matches the given query.":
      toast.error(t("hut_not_found"));
      return;
    case "Exceeds maximum kids allowed for this hut.":
      toast.error(t("exceeds_max_kids"));
      return;
    case "Extra dates must be directly adjacent to existing booking":
      toast.error(t("extra_dates_adjacent"));
      setError("date_from", {
        type: "manual",
        message: "extra_dates_adjacent",
      });
      setError("date_to", {
        type: "manual",
        message: "extra_dates_adjacent",
      });
      return;
    case "Extra dates must be within the same month":
      toast.error(t("extra_dates_same_month"));
      setError("date_from", {
        type: "manual",
        message: "extra_dates_same_month",
      });
      setError("date_to", {
        type: "manual",
        message: "extra_dates_same_month",
      });
      return;
    case "End date must be within the current month.":
      toast.error(t("end_date_same_month"));
      setError("date_to", {
        type: "manual",
        message: "end_date_same_month",
      });
      return;
    case "Start date must be within the current month.":
      toast.error(t("end_date_same_month"));
      setError("date_from", {
        type: "manual",
        message: "end_date_same_month",
      });
      return;
    case "Start date cannot be in the past.":
      toast.error(t("start_date_in_past"));
      setError("date_from", {
        type: "manual",
        message: "start_date_in_past",
      });
      return;
    case "You can only have one booking per month.":
      toast.error(t("one_booking_per_month"));
      return;
    case "You already rated this hut.":
      toast.error(t("already_rated"));
      return;
    case "Invalid promo code.":
      toast.error(t("invalid_promo_code"));
      return;
    default:
      toast.error(t("unexpected_error"));
      return;
  }
};
