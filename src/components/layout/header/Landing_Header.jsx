import React from "react";
import { useTranslation } from "react-i18next";

/**
 * Section heading, per the Ken design system.
 *
 * This used to composite a translated swirl PNG behind every title -- a
 * different asset per section and per language, positioned with a table of
 * hand-tuned offsets. The system replaces that with clean display typography:
 * it reads more premium, needs no asset swap to localise, and scales instead
 * of relying on pixel nudges at each breakpoint.
 *
 * The prop signature is unchanged so all call sites keep working; `src` is
 * accepted and ignored, since there is no longer a pattern to choose.
 */
const Landing_Header = ({
  title = "",
  textClassName,
  containerClassName,
  isCentered = true,
}) => {
  const { t } = useTranslation();
  return (
    <header
      className={`section_header ${isCentered ? "is_centered" : ""} ${
        containerClassName ?? ""
      }`}
    >
      <h2 className={`section_header_title ${textClassName ?? ""}`}>
        {t(title)}
      </h2>
    </header>
  );
};

export default Landing_Header;
