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
          value: isConfirm
            ? data?.hut_details?.max_persons_num
            : data?.max_persons_num,
          message: `${t("max_number_of_adult")}: ${
            isConfirm
              ? data?.hut_details?.max_persons_num
              : data?.max_persons_num
          } `,
        },
      },

      insteraction: `→ ${t("max_number_of_adult")}:${
        isConfirm
          ? data?.hut_details?.max_persons_num
          : data?.max_persons_num || 0
      }`,
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
          value: isConfirm
            ? data?.hut_details?.max_kids_num
            : data?.max_kids_num,
          message: `${t("max_number_of_kids")}: ${
            isConfirm ? data?.hut_details?.max_kids_num : data?.max_kids_num
          } `,
        },
      },
      insteraction: `→ ${t("max_number_of_kids")}:${
        isConfirm ? data?.hut_details?.max_kids_num : data?.max_kids_num || 0
      }`,
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

  const asMoney = (value) => (Number.isFinite(value) ? Math.round(value) : 0);

  const subtotal = asMoney(stay.total + extrasTotal);
  // On the confirm page the booking already carries the percentage the server
  // applied. The code itself is deliberately never returned, which is why this
  // reads a plain percentage rather than a promocode object.
  const confirmedPercent = Number(data?.discount_percentage) || 0;
  const discountPercent =
    subtotal > 0 ? (isConfirm ? confirmedPercent : typedPercent) : 0;
  const discount = asMoney((subtotal * discountPercent) / 100);
  const totalPrice = subtotal - discount;

  // Total is the subtotal less the discount, so the two rows can only differ
  // when a promo code applied. With nothing to break down -- no discount, and
  // no events or services on sale -- a Subtotal row just prints Total twice.
  const pricesList = [
    ...(discount > 0
      ? [
          { id: 1, label: "subtotal", value: `${subtotal} ${t("sar")}` },
          { id: 2, label: "discount", value: `- ${discount} ${t("sar")}` },
        ]
      : []),
    { id: 3, label: "total", value: `${totalPrice} ${t("sar")}` },
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
                {`${stay.nights} ${t("nights")}`}
                {stay.longStay && ` · ${t("long_stay_note")}`}
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
