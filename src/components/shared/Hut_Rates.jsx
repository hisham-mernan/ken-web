import React from "react";
import { useTranslation } from "react-i18next";

/**
 * A hut's two nightly rates, weekday and weekend.
 *
 * Shared so the home panels, the huts index and anywhere else that lists a
 * hut show the same pair in the same order. Every surface used to print a
 * single `lowest_price`, which could not say that a Friday night costs more
 * than a Tuesday one.
 *
 * Renders nothing when neither rate is set, rather than a bare "0 SAR" --
 * a hut whose rates an admin has not filled in yet should look priceless,
 * not free.
 *
 * `tone` picks the palette: "light" for the dark photographic panels,
 * "dark" for the ivory pages.
 */
const Hut_Rates = ({ hut, tone = "dark", className = "" }) => {
  const { t } = useTranslation();

  const weekday = Number(hut?.weekday_price) || 0;
  const weekend = Number(hut?.weekend_price) || 0;
  if (!weekday && !weekend) return null;

  const rates = [
    { key: "weekday", amount: weekday, label: t("weekday_night") },
    { key: "weekend", amount: weekend, label: t("weekend_night") },
  ].filter((rate) => rate.amount > 0);

  return (
    <div className={`hut_rates is_${tone} ${className}`}>
      {rates.map((rate) => (
        <div key={rate.key} className="hut_rate">
          <span className="hut_rate_amount">
            {rate.amount}
            <span className="hut_rate_currency"> {t("sar")}</span>
          </span>
          <span className="hut_rate_label">{rate.label}</span>
        </div>
      ))}
    </div>
  );
};

export default Hut_Rates;
