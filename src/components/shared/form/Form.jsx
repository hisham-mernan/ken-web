import { useState } from "react";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { InputOtp } from "primereact/inputotp";
import Upload_Image from "./Upload_Image";
import Input_Calendar from "./Input_Calendar";
import StareRate from "../rate/StareRate";
import { Checkbox } from "primereact/checkbox";
import { Skeleton } from "primereact/skeleton";
import { Dropdown } from "primereact/dropdown";

const Form = ({
  formList = [],
  control,
  setError,
  errors,
  loading,
  dataLoader,
  groupStyle,
  viewOnly = false,
  skeleton,
}) => {
  const { t } = useTranslation();

  const renderField = (item, field, t, error) => {
    const isDisabled = viewOnly || item?.disabled || loading;

    switch (item?.formType) {
      case "input":
        return skeleton ? (
          <Input_Skeleton />
        ) : (
          <section className="flex flex-col gap-1 ">
            <div
              className={`flex input gap-4 ${isDisabled ? "disabled" : ""}  
              ${
                !viewOnly &&
                (error?.message || errors?.[item?.fieldName]?.message)
                  ? "!border-red-dark"
                  : ""
              } focus-within:!border-secondary ${item?.inputClassName}  ${
                item?.inputContainerClassName
              }`}
            >
              <span className="flex_center">{item.icon}</span>

              <input
                id={item?.id}
                name={item?.name}
                type={item?.type}
                value={item?.value ?? field.value}
                readOnly={viewOnly}
                disabled={isDisabled}
                placeholder={t(item?.placeholder || "")}
                className={`flex-1 ${
                  viewOnly ? "placeholder:!text-secondary-dark" : ""
                } ${item?.inputClassName}`}
                min={0}
                autoComplete="off"
                onWheel={(e) => e.target.blur()}
                onChange={(e) => {
                  if (!viewOnly) {
                    if (item.type === "email") {
                      const element = e.target.value.toLowerCase();
                      field.onChange(element);
                    } else {
                      field.onChange(e);
                    }
                  }
                }}
                onKeyDown={item?.onKeyDown}
                onInput={(e) => {
                  if (!viewOnly) item?.onInput?.(e, field);
                }}
              />
            </div>

            {item?.insteraction &&
              !(error?.message || errors?.[item?.fieldName]?.message) && (
                <p
                  className="text-[#BBBEBD] text-base font-normal"
                  dangerouslySetInnerHTML={{ __html: item.insteraction }}
                />
              )}
          </section>
        );

      case "phone_number":
        return skeleton ? (
          <Input_Skeleton />
        ) : (
          <div
            dir="ltr"
            className={`flex input gap-4  ${item?.inputContainerClassName}  ${
              isDisabled ? "disabled" : ""
            }
            ${
              !viewOnly &&
              (error?.message || errors?.[item?.fieldName]?.message)
                ? "!border-red-dark"
                : ""
            } focus-within:!border-secondary`}
          >
            <span className="text-black">+966</span>

            <input
              id={item?.id}
              name={item?.name}
              type="tel"
              value={field.value}
              readOnly={viewOnly}
              disabled={isDisabled}
              placeholder={t(item?.placeholder || "")}
              className={`flex-1 ${
                viewOnly ? "placeholder:!text-secondary-dark" : ""
              }`}
              min={0}
              onWheel={(e) => e.target.blur()}
              autoComplete="off"
              onChange={(e) => {
                if (!viewOnly) field.onChange(e);
              }}
              onInput={(e) => {
                if (!viewOnly) item?.onInput?.(e, field);
              }}
            />
          </div>
        );

      case "dropdown":
        return (
          <section className={item?.showInlineError ? "grid gap-2" : ""}>
            <div
              className={`flex input gap-4 form_dropdown ${item?.inputClassName}
              ${isDisabled ? "disabled" : ""} 
              ${
                !viewOnly &&
                (error?.message || errors?.[item?.fieldName]?.message)
                  ? "!border-red-dark"
                  : ""
              } focus-within:!border-secondary-light`}
            >
              {item?.icon && <span className="flex_center">{item.icon}</span>}

              <Dropdown
                options={item?.optionList}
                value={field.value}
                disabled={isDisabled || item?.loading}
                placeholder={t(item?.placeholder || "")}
                className={`flex-1 w-full !p-0 ${error ? "input_error" : ""}`}
                optionLabel="name"
                inputId={item?.id}
                filter={item?.hasFilter || false}
                loading={item?.loading}
                onChange={(e) => {
                  if (!viewOnly) {
                    if (item?.action) item.action(e.value);
                    field.onChange(e);
                  }
                }}
              />
            </div>

            {item?.showInlineError && (
              <p className="text-red-dark text-xs">{t(error?.message)}</p>
            )}
          </section>
        );

      case "otp":
        return (
          <div dir="ltr">
            <InputOtp
              value={field.value}
              disabled={isDisabled}
              integerOnly
              className="otp"
              length={6}
              invalid={error?.message || errors?.[item.fieldName]?.message}
              onChange={(e) => {
                if (!viewOnly) field.onChange(e.value);
              }}
            />
          </div>
        );

      case "calendar":
        return (
          <Input_Calendar
            id={item?.id}
            label={item?.label}
            error={
              viewOnly
                ? false
                : error?.message || errors?.[item.fieldName]?.message
            }
            value={field.value}
            readOnly={viewOnly}
            disabled={isDisabled}
            placeholder={item?.placeholder}
            hasRequiredStar={item.hasRequiredStar}
            allowedDates={item?.allowedDates}
            loading={dataLoader}
            viewOnly={viewOnly}
            handleChange={(e) => {
              if (!viewOnly) field.onChange(e.value);
            }}
          />
        );

      case "image":
        return (
          <Upload_Image
            value={field.value || ""}
            setError={setError}
            disabled={isDisabled}
            error={error?.message || errors?.[item?.fieldName]?.message}
            fieldName={item?.fieldName}
            handleChange={(e) => field.onChange(e)}
            loading={skeleton}
          />
        );

      case "star":
        return (
          <StareRate
            defaultRating={field.value}
            des={item?.des}
            onSetRating={(v) => {
              if (!viewOnly) field.onChange(v);
            }}
          />
        );

      case "textarea":
        return (
          <div
            className={`flex !items-start input !h-[126px] gap-4
            ${isDisabled ? "disabled" : ""} 
            ${
              !viewOnly &&
              (error?.message || errors?.[item?.fieldName]?.message)
                ? "!border-red-dark"
                : ""
            } focus-within:!border-secondary ${item?.inputClassName}`}
          >
            <span className="flex_center">{item.icon}</span>

            <textarea
              id={item?.id}
              name={item?.name}
              value={field.value}
              readOnly={viewOnly}
              disabled={isDisabled}
              onChange={(e) => {
                if (!viewOnly) field.onChange(e);
              }}
              placeholder={t(item?.placeholder || "")}
              className={`flex-1 text-sm h-full resize-none outline-none
              ${viewOnly ? "placeholder:!text-secondary-dark" : ""}
              ${item?.inputClassName}`}
              min={0}
              onWheel={(e) => e.target.blur()}
              onInput={(e) => {
                if (!viewOnly) item?.onInput?.(e, field);
              }}
            />
          </div>
        );

      case "checkbox":
        return (
          <div className="flex_center_y gap-2">
            <Checkbox
              checked={field.value}
              disabled={isDisabled}
              inputId={item?.id || "terms_and_condition"}
              invalid={
                viewOnly
                  ? false
                  : error || errors?.[item.fieldName]
                  ? true
                  : false
              }
              onChange={(e) => {
                if (!viewOnly) field.onChange(e);
              }}
            />
            <label
              htmlFor={item?.id || "terms_and_condition"}
              className="text-primary-4 font-normal flex_center_y gap-1 capitalize text-base lg:text-lg"
            >
              {item?.title}
            </label>
          </div>
        );

      default:
        return null;
    }
  };
  return (
    <>
      {formList?.map((item) =>
        dataLoader ? (
          <section className={`grid gap-2 content-baseline ${item?.className}`}>
            <Skeleton width="100px" />
            <Skeleton className="w-full !h-[45px] lg:!h-[57px]" />
          </section>
        ) : (
          item && (
            <fieldset
              key={item?.id}
              className={`grid gap-2 content-baseline ${item?.className}`}
            >
              {item?.seprator && (
                <div className="w-full mb-3 h-[.5px] border border-dashed border-[#c8c8c8a9]" />
              )}

              {(item?.label || item?.hasDelete) && (
                <div
                  className={
                    item?.hasDelete ? "flex_center_y justify-end gap-2" : ""
                  }
                >
                  {item?.label && (
                    <label
                      htmlFor={item.id}
                      className={`flex-1 flex items-center gap-1 text-base text-[#5D5D5D] font-normal capitalize ${
                        item?.labelClassName ?? ""
                      }`}
                    >
                      {item?.hasRequiredStar && (
                        <span className="text-secondary font-base">*</span>
                      )}

                      <span className={`${item?.labelClassName ?? "body_lg"}`}>
                        {t(item?.label)}
                      </span>
                    </label>
                  )}
                </div>
              )}

              {item?.formType !== "label_groups" && (
                <>
                  <Controller
                    name={item?.fieldName}
                    control={control}
                    rules={item?.validator}
                    render={({ field, fieldState: { error } }) =>
                      renderField(item, field, t, error)
                    }
                  />

                  {!viewOnly &&
                    errors?.[item?.fieldName] &&
                    errors[item?.fieldName]?.message && (
                      <p className="text-red-dark text-xs">
                        {t(errors[item?.fieldName]?.message)}
                      </p>
                    )}
                </>
              )}

              {item?.showForgetPassword && (
                <Link
                  to="/account/forget-password"
                  className="flex items-center justify-end text-primary-dark text-sm font-[300] underline underline-offset-1"
                >
                  {t("forget_password")}
                </Link>
              )}
            </fieldset>
          )
        )
      )}
    </>
  );
};

const Input_Skeleton = () => {
  return <Skeleton className="input !h-[45px] xl:!h-[56px]" />;
};

export default Form;
