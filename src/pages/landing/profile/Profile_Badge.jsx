import React from "react";

// lib
import { useTranslation } from "react-i18next";

// assets
import { Star2Icon } from "../../../assets/icons/Icon";

/**
 * The customer's loyalty standing.
 *
 * Every field here used to be static: the page congratulated each visitor as
 * a Gold Member whatever their history. That was harmless placeholder copy
 * until tiers started carrying a real discount -- at which point the profile
 * was promising 15% to people the checkout charges in full.
 *
 * `standing` comes from /api/products/loyalty/me/. Until it arrives, or for
 * somebody who has not earned a tier yet, the panel says what would earn one
 * instead of claiming they already have.
 */
const Profile_Badge = ({ standing }) => {
  const { t } = useTranslation();

  const tier = standing?.tier || "";
  const percent = Number(standing?.percent) || 0;
  const nextTier = standing?.next_tier || "";
  const toNext = Number(standing?.stays_to_next) || 0;

  const earned = Boolean(tier);
  const tierLabel = earned ? t(`tier_${tier}`) : "";
  const nextLabel = nextTier ? t(`tier_${nextTier}`) : "";
  // The percentages are the published ladder, kept here only so the panel can
  // name the prize before it is won.
  const nextPercent = { bronze: 5, silver: 10, gold: 15 }[nextTier] || 0;

  const headline = earned
    ? t("tier_member", { tier: tierLabel })
    : t("no_tier_badge");

  const detail = earned
    ? t("tier_benefit", { percent })
    : nextTier
    ? // Arabic counts one, two and many differently, so the dual gets its own
      // string rather than reading "2 stays" in a language that has no such form.
      t(
        toNext === 1
          ? "tier_progress_one"
          : toNext === 2
          ? "tier_progress_two"
          : "tier_progress_many",
        {
          count: toNext,
          tier: nextLabel,
          percent: nextPercent,
        }
      )
    : t("badge_des");

  return (
    <section className="primary_gradiant flex-col sm:flex-row px-4 md:px-8 lg:px-12 py-5 sm:py-[28px] rounded-2xl flex items-center text-center sm:text-start gap-2 md:gap-5">
      <span className="star_gradiant flex flex-col items-center justify-center w-11 h-11 sm:w-14 sm:h-14 rounded-full shrink-0">
        <Star2Icon />
      </span>
      <div className="flex-1 grid gap-1">
        <h2 className="text-[#E8D5A8] text-base md:text-xl lg:text-[22px] font-bold">
          {headline}
        </h2>
        <p className="font-light text-[#9C9E90CC] text-xs md:text-sm">
          {detail}
        </p>
      </div>
      {/* Only shown once it is real. A pill naming a tier nobody holds is the
          bug this component was. It carries the discount rather than repeating
          the headline, which is the part a guest actually wants at a glance. */}
      {earned && (
        <span className="text-[#E8D5A8] text-[13px] font-semibold tracking-[1px] flex h-[33px] items-center justify-center text-center border border-[#C9A96E4D] py-2 px-6 rounded-full bg-[#C9A96E26] shrink-0">
          {t("tier_pill", { percent })}
        </span>
      )}
    </section>
  );
};

export default Profile_Badge;
