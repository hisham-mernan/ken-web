import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Skeleton } from "primereact/skeleton";

import axiosInstance from "../../../service/axiosInstance";
import { API } from "../../../service/apiUrl";
import { getImageUrl, IMG } from "../../../utils/getImageUrl";
import Page_Nout_Found from "../404/Page_Nout_Found";

/**
 * A booking opened from the link in a guest's confirmation email.
 *
 * There is no account behind a guest booking, so the unguessable token in the
 * URL is what identifies it. The API only ever resolves tokens for bookings
 * that have no user, so this page cannot be used to reach someone's account.
 */
const Guest_Booking = () => {
  const { accessToken } = useParams();
  const { t } = useTranslation();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const response = await axiosInstance.get(
          `${API.booking.by_token}${accessToken}/`
        );
        if (!cancelled) setBooking(response?.data ?? null);
      } catch {
        if (!cancelled) setNotFound(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [accessToken]);

  if (loading) {
    return (
      <main className="page_p Container flex flex-col gap-6">
        <Skeleton width="240px" height="2rem" />
        <Skeleton width="100%" height="320px" className="rounded-lg" />
      </main>
    );
  }

  if (notFound || !booking) {
    return <Page_Nout_Found text="booking_not_found" btnLink="/" btnName="back_to_home" />;
  }

  const mainDate = booking?.dates?.[0];

  return (
    <main className="page_p Container flex flex-col gap-8">
      <h1 className="headline_lg text-secondary-dark">
        {t("booking_number")} #{booking?.id}
      </h1>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <figure className="w-full h-[280px] rounded-lg overflow-hidden border border-font-light">
          {booking?.hut?.main_image ? (
            <img
              src={getImageUrl(booking.hut.main_image, {
                width: IMG.card,
              })}
              alt={booking?.hut?.title ?? ""}
              decoding="async"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="w-full h-full flex bg-gray-50" />
          )}
        </figure>

        <ul className="flex flex-col gap-4 text-primary-3">
          <li className="flex justify-between gap-4">
            <span className="font-semibold">{t("hut")}</span>
            <span>{booking?.hut?.title ?? "-"}</span>
          </li>
          {mainDate && (
            <li className="flex justify-between gap-4">
              <span className="font-semibold">{t("date")}</span>
              <span>
                {mainDate?.date_from} → {mainDate?.date_to}
              </span>
            </li>
          )}
          <li className="flex justify-between gap-4">
            <span className="font-semibold">{t("status")}</span>
            <span className="capitalize">{booking?.status}</span>
          </li>
          <li className="flex justify-between gap-4">
            <span className="font-semibold">{t("total_price")}</span>
            <span>{booking?.total_price}</span>
          </li>
        </ul>
      </section>

      <p className="body_sm text-primary-4">{t("guest_booking_email_note")}</p>
    </main>
  );
};

export default Guest_Booking;
