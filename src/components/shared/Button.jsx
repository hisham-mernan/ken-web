import React from "react";
import { Link } from "react-router-dom";
import Spinner from "./loaders/Spinner";

const Button = ({
  children,
  onClick,
  to,
  type = "primary",
  role = "button",
  size = "lg",
  rounded = "full",
  textSize = "title_lg",
  disabled,
  loading,
  className,
  target,
  loaderDir = "right",
  hasFullWidth = true,
  iconRight,
  iconLeft,
}) => {
  const sizes = {
    lg: "h-[48px] 2xl:h-[54px]  ",
    md: "h-[40px]  ",
  };
  const radious = {
    full: "rounded-full",
    xl: "rounded-[10px]",
    lg: "rounded-lg",
  };
  const textSizes = {
    lg: "title_lg",
    base: "body_lg",
    sm: "body_sm",
  };
  // ds_button carries the shared design-system behaviour: body face, 1px lift
  // on hover, and the fast standard ease. Kept in CSS so every variant below
  // inherits it without repeating utility strings.
  const base = `${sizes[size]} ${radious[rounded]} ${textSizes[textSize]} ${
    hasFullWidth ? "w-full" : ""
  } ds_button outline-none cursor-pointer disabled:cursor-default !font-semibold p-4 flex items-center justify-center gap-2 `;
  const styles = {
    primary_light: `${base} ds_button_raised  bg-primary-4 hover:bg-primary-5 disabled:bg-[#dddddd] disabled:cursor-not-allowed disabled:text-primary/30  text-white `,
    light: `${base}  bg-white hover:bg-light  text-secondary-2 !font-normal `,
    primary: `${base} ds_button_raised  bg-primary-2 disabled:bg-[#dddddd] disabled:cursor-not-allowed disabled:text-primary/30  text-white `,
    error: `${base} ds_button_raised  bg-red-dark  text-white `,
    primary_dark: `${base} ds_button_raised  bg-primary-dark  border border-primary-dark  disabled:bg-[#dddddd] disabled:cursor-not-allowed disabled:text-primary/30  text-font-light `,
    secondary_light: `${base} ds_button_raised bg-secondary-2 hover:bg-secondary-3 disabled:bg-[#6E513570]   text-white `,
    secondary_lighter: `${base} ds_button_raised bg-secondary-light button_shadow  disabled:bg-[#6E513570]   text-white `,
    secondary: `${base} ds_button_raised bg-secondary hover:bg-secondary-1 disabled:bg-secondary/10 disabled:text-secondary/30  text-white `,
    outline: `${base} border border-[#C8C8C891] bg-white text-[#5D5D5D]`,
    outline_primary: `outline-0 shadow-none flex_center gap-2.5 text-primary-2  w-full border border-primary-2 rounded-lg ${base}`,
    outline_secondary: `outline-0 shadow-none flex_center gap-2.5 text-secondary-4  w-fit border border-secondary-4 rounded-[10px] backdrop-blur-[20px] py-2 px-5`,
    glass: `${base} bg-[#FFEEDD1A] backdrop-blur-[20px] border border-primary-light text-primary-light !text-base font-bold p-[20px]  `,
    disabled: `${base} bg-[#6E513570] text-white `,
    glass_40:
      "glass_effect_40  flex items-center justify-center text-center text-white",

    glass_gradiant:
      "glass_effect_gradiant flex items-center justify-center text-center text-white",

    glass_gradiant_light:
      "glass_effect_gradiant_light flex items-center justify-center text-center text-primary-dark",
  };
  const spinnerFillColor = {
    error: "fill-error",
    primary: "!fill-neutral-200  !text-secondary",
    outline: "!text-neutral-200  !fill-secondary",
  };
  if (to)
    return (
      <Link
        to={to}
        target={target}
        className={`${styles[type]}  ${className}  `}
      >
        {iconRight}
        {children}
        {iconLeft}
      </Link>
    );
  return (
    <button
      disabled={disabled || loading}
      onClick={onClick}
      type={role}
      className={`${styles[type]}  ${className}`}
    >
      {loading ? (
        loaderDir === "right" && <Spinner className={spinnerFillColor[type]} />
      ) : (
        <span>{iconRight}</span>
      )}
      {children}
      {loading ? (
        loaderDir === "left" && <Spinner className={spinnerFillColor[type]} />
      ) : (
        <span>{iconLeft}</span>
      )}
    </button>
  );
};
export default Button;
