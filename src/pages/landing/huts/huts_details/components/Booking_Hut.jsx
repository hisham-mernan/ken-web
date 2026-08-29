// lib

import { useTranslation } from "react-i18next";
import { Link, useNavigate, useParams } from "react-router-dom";

// component
import Form from "../../../../../components/shared/form/Form";
import Button from "../../../../../components/shared/Button";

// assets
import {
  EditPenIcon,
  PercentageIcon,
  UsersIcon,
} from "../../../../../assets/icons/Icon";
import { useEffect, useState } from "react";
import { useAuth } from "../../../../../context/Auth_Context";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { isRangeAvailable } from "../../../../../utils/validator";
import { formatDateToYYYYMMDD } from "../../../../../utils/formateDateToYYYYMMDD";
import { quoteStay } from "../../../../../utils/hutPricing";
import axiosInstance from "../../../../../service/axiosInstance";
import { API } from "../../../../../service/apiUrl";

const Booking_Hut = ({
  setError,
  watch,
  data,
  special,
  errors,
  control,
  loading,
  isDisabled = false,
  isConfirm = false,
  title = "booking",
  available_dates,
  eventTickets,
  serviceTickets,
}) => {
  const { t } = useTranslation();
  // max_persons_num is the whole overnight capacity, children included;
  // max_kids_num only caps how many of it may be children.
  const capacityHut = isConfirm ? data?.hut_details : data;
  const capacity = Number(capacityHut?.max_persons_num) || 0;
  const maxKids = Number(capacityHut?.max_kids_num) || 0;
  // Children come out of the same capacity as adults, so how many are allowed
  // depends on how many adults were entered. The flat max_kids_num told a
  // guest of the small cottage that one child was fine when two adults had
  // already filled it, and the refusal then read "Maximum guests: 2" on the
  // children field -- which looks like the children limit is 2 and broken.
  const adultsEntered = Number(watch("persons_max_num")) || 0;
  const kidsAllowed = Math.max(0, Math.min(maxKids, capacity - adultsEntered));
  const navigate = useNavigate();
  const { id } = useParams();
  const [disabled, setDisabled] = useState(isDisabled);
  const { token } = useAuth();
  // ____________ list __________________
  const formList = [
    {
      id: 0,
      formType: "calendar",
      fieldName: "date_from",
      label: "from",
      name: "from",
      placeholder: `5-5-${new Date().getFullYear()}`,
      validator: {
        required: "required_field",
      },
      disabled: disabled,
      allowedDates: available_dates,
      className: "col-span-1 lg:col-span-2",
    },
    {
      id: 1,
      formType: "calendar",
      fieldName: "date_to",
      label: "to",
      name: "to",
      placeholder: `5-5-${new Date().getFullYear()}`,
      allowedDates: available_dates,
      validator: {
        required: "required_field",
        validate: (value) => {
          const fromDate = watch("date_from");
          if (!fromDate) {
            setError("date_from", {
              type: "manual",
              message: "required_field",
            });
            return "set_from_date";
          }

          const fromValue = new Date(fromDate);
          const toValue = new Date(value);

          fromValue.setHours(0, 0, 0, 0);
          toValue.setHours(0, 0, 0, 0);

          if (isNaN(fromValue) || isNaN(toValue)) {
            return "invalid_date";
          }

          if (toValue <= fromValue) {
            return "to_date_must_be_after_from";
          }

          const dates = isConfirm
            ? data?.hut_details?.available_dates
            : available_dates;

          if (!isRangeAvailable(fromValue, toValue, dates)) {
            return t("date_range_not_available", {
              from: formatDateToYYYYMMDD(fromValue),
              to: formatDateToYYYYMMDD(toValue),
            });
          }

          return true;
        },
      },
      disabled: disabled,
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
      validator: {
        required: "required_field",
        min: {
          value: 0,
          message: `${t("min_number_of_adult")}: 0 `,
        },
        max: {
          value: capacity,
          message: `${t("max_number_of_guests")}: ${capacity} `,
        },
        // The server counts the whole party against one capacity, so the form
        // has to as well -- otherwise the guest fills both fields, is told
        // nothing, and only finds out when the booking is refused.
        validate: (value) =>
          Number(value || 0) + Number(watch("kids_max_num") || 0) <= capacity ||
          t("party_shares_capacity", { capacity }),
      },

      insteraction: `→ ${t("max_number_of_guests")}: ${capacity}`,
      icon: <UsersIcon />,
      disabled: disabled,
    },
    {
      id: 3,
      formType: "input",
      fieldName: "kids_max_num",
      name: "kids",

      placeholder: `2 ${t("kids")}`,
      type: "number",
      validator: {
        required: "required_field",
        min: {
          value: 0,
          message: `${t("min_number_of_kids")} 0 `,
        },
        max: {
          value: kidsAllowed,
          message: t("party_shares_capacity", { capacity }),
        },
        validate: (value) =>
          Number(value || 0) + Number(watch("persons_max_num") || 0) <=
            capacity || t("party_shares_capacity", { capacity }),
      },
      insteraction: `→ ${t("max_number_of_kids")}: ${kidsAllowed}`,
      icon: <UsersIcon />,
      disabled: disabled,
    },
    !isConfirm && {
      id: 4,
      formType: "input",
      fieldName: "promocode",
      name: "do_you_have_prome_code",
      label: "do_you_have_prome_code",
      placeholder: "add_here",

      icon: <PercentageIcon />,
      disabled: disabled,
      className: "col-span-1 lg:col-span-2",
    },
  ];
  const terms = [
    !isConfirm && {
      id: 5,
      formType: "checkbox",
      fieldName: "terms",
      name: "do_you_have_prome_code",
      title: <Terms_And_Condtion_Checkbox />,
      validator: {
        required: "required_field",
      },
      disabled: disabled,
      className: "col-span-1 lg:col-span-2",
    },
  ].filter(Boolean);
  // The hut itself, at its weekday/weekend rates. Mirrors the server rule in
  // src/utils/hutPricing.js -- the nights used to be priced from whichever
  // available-date range happened to cover them, which meant a stay spanning
  // two ranges silently fell back to the server's stale total.
  const hut = isConfirm ? data?.hut_details : data;
  const stay = quoteStay(hut, watch("date_from"), watch("date_to"));

  // What the customer's past stays are worth to them. Only the signed-in
  // caller's own standing is available -- a guest still earns and receives the
  // tier discount, it is just applied when the booking is priced rather than
  // previewed here, because looking one up would mean answering questions
  // about a phone number to whoever asked.
  const [tier, setTier] = useState(null);
  useEffect(() => {
    if (isConfirm || !token) return;
    let cancelled = false;
    axiosInstance
      .get(API.booking.loyalty)
      .then((res) => !cancelled && setTier(res?.data || null))
      .catch(() => !cancelled && setTier(null));
    return () => {
      cancelled = true;
    };
  }, [isConfirm, token]);

  // The discount a code typed into this form is worth, so the guest sees what
  // they are saving before committing rather than first at confirmation. The
  // server is asked because the hut payload no longer lists its codes -- it
  // used to, which handed a working discount to anyone reading the API.
  const typedCode = watch("promocode");
  const [typedPercent, setTypedPercent] = useState(0);

  useEffect(() => {
    if (isConfirm) return; // confirmation reads the applied figure off the booking
    const code = (typedCode || "").trim();
    const hutId = hut?.id;
    if (!code || !hutId) {
      setTypedPercent(0);
      return;
    }
    // Debounced: this fires on every keystroke otherwise.
    const timer = setTimeout(async () => {
      try {
        const res = await axiosInstance.post(API.booking.validate_promocode, {
          hut: hutId,
          code,
        });
        setTypedPercent(res?.data?.valid ? Number(res.data.percentage) || 0 : 0);
      } catch {
        // An unreachable check must not invent a discount the server will not
        // honour, so a failure shows no discount rather than a stale one.
        setTypedPercent(0);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [typedCode, hut?.id, isConfirm]);

  // Everything booked alongside the hut.
  const extrasTotal = [special, eventTickets, serviceTickets]
    .filter((list) => list?.length > 0)
    .flat()
    .reduce(
      (sum, item) => sum + Number(item.quantity || 0) * Number(item.price || 0),
      0
    );

  // Money to the halala, matching the server. This used to round to whole
  // riyals, which quoted a guest 1377 for a stay products/loyalty.py then
  // charged 1377.50 for -- and made a small discount vanish entirely: 5% of a
  // 5 SAR test rate rounded to nothing while the tier note above still
  // promised it.
  const asMoney = (value) =>
    Number.isFinite(value) ? Math.round(value * 100) / 100 : 0;
  // Whole riyals stay whole; only a fractional amount spends the two decimals.
  const showMoney = (value) =>
    Number.isInteger(value) ? String(value) : value.toFixed(2);

  const subtotal = asMoney(stay.total + extrasTotal);
  // On the confirm page the booking already carries the percentage the server
  // applied. The code itself is deliberately never returned, which is why this
  // reads a plain percentage rather than a promocode object.
  const confirmedPercent = Number(data?.discount_percentage) || 0;
  // The server charges the better of the code and the tier, never both added
  // together, so the preview has to do the same or it promises a total that
  // will not be honoured.
  const tierPercent = Number(tier?.percent) || 0;
  const previewPercent = Math.max(typedPercent, tierPercent);
  const discountPercent =
    subtotal > 0 ? (isConfirm ? confirmedPercent : previewPercent) : 0;
  const discount = asMoney((subtotal * discountPercent) / 100);
  const totalPrice = asMoney(subtotal - discount);

  // Total is the subtotal less the discount, so the two rows can only differ
  // when a promo code applied. With nothing to break down -- no discount, and
  // no events or services on sale -- a Subtotal row just prints Total twice.
  const pricesList = [
    ...(discount > 0
      ? [
          { id: 1, label: "subtotal", value: `${showMoney(subtotal)} ${t("sar")}` },
          { id: 2, label: "discount", value: `- ${showMoney(discount)} ${t("sar")}` },
        ]
      : []),
    { id: 3, label: "total", value: `${showMoney(totalPrice)} ${t("sar")}` },
  ];
  return (
    <section className="Container ">
      <div className="secondary_border form_p flex flex-col gap-[50px] ">
        {isConfirm && (
          <span
            className="flex items-end ms-auto cursor-pointer"
            onClick={() => {
              setDisabled((pre) => !pre);
            }}
          >
            <EditPenIcon />
          </span>
        )}
        <h2 className=" font-bold text-[36px] text-primary-2  ">{t(title)}</h2>
        <div className="flex flex-col gap-4 lg:gap-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            <Form
              formList={formList}
              control={control}
              errors={errors}
              loading={loading}
              setError={setError}
            />
          </div>
          <footer className="flex flex-col gap-3">
            {/* Why the total is what it is. Without this the long-stay rule is
                invisible -- a guest adding a third night sees the figure move
                and cannot tell whether it is a discount or a mistake. */}
            {stay.nights > 0 && (
              <p className="text-primary-3 text-sm">
                {t("stay_nights", { count: stay.nights })}
                {stay.longStay && ` · ${t("long_stay_note")}`}
              </p>
            )}
            {!isConfirm && tierPercent > 0 && tierPercent >= typedPercent && (
              <p className="text-primary-2 text-sm font-medium">
                {t("tier_note", {
                  tier: t(`tier_${tier?.tier}`),
                  percent: tierPercent,
                })}
              </p>
            )}
            {pricesList?.map((item) => (
              <div
                key={item?.id}
                className="text-primary-dark flex_center_y justify-between gap-2"
              >
                <span className="text-sm font-semibold">{t(item?.label)}</span>
                <strong className=" text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl">
                  {item?.value}
                </strong>
              </div>
            ))}
          </footer>
          {/* terms */}
          {!isConfirm && (
            <fieldset>
              <Form
                formList={terms}
                control={control}
                errors={errors}
                loading={loading}
                setError={setError}
              />
            </fieldset>
          )}
          {!isConfirm && (
            <Button role="submit" loading={loading}>
              {" "}
              {t("book_now")}
            </Button>
          )}
        </div>
      </div>
    </section>
  );
};
const Terms_And_Condtion_Checkbox = () => {
  const { t } = useTranslation();
  return (
    <>
      <span>{t("i_accept_all")}</span>
      <Link
        to="/terms-and-conditions"
        target="_blank"
        className="outline-none underline underline-offset-2 decoration-primary-4 "
      >
        {" "}
        {t("terms_and_conditions")}
      </Link>
    </>
  );
};
export default Booking_Hut;
