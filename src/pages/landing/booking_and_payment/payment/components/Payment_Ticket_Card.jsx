import { Skeleton } from "primereact/skeleton";
import React from "react";
import { useTranslation } from "react-i18next";

const Payment_Ticket_Card = ({
  title,
  description,
  img,
  className = "",
  button,
  loading,
}) => {
  const { t } = useTranslation();
  if (loading) {
    return (
      <Ticket_Card_Skeleton
        className={className}
        title={title}
        button={button}
      />
    );
  }
  return (
    <div
      className={`${className}  secondary_border ticket_card text-center gap-14  `}
    >
      <div className="flex flex-col gap-[10px] items-center justify-center text-center">
        <span className=" text-[25px] lg:text-[30px]">{t(title)}</span>
        {img && (
          <img loading="lazy" decoding="async"
            src={img}
            className="w-[200px] h-[200px] md:w-[300px] md:h-[300px] object-contain rounded-[10px]"
          />
        )}
        <p
          className="text-[#808080] text-base lg:text-lg "
          dangerouslySetInnerHTML={{ __html: t(description) }}
        />
      </div>
      {button && button()}
    </div>
  );
};
const Ticket_Card_Skeleton = ({ className, title, button }) => {
  const { t } = useTranslation();
  return (
    <div
      className={`${className}  secondary_border ticket_card text-center gap-14  `}
    >
      <div className="flex flex-col gap-[10px] items-center justify-center text-center">
        <span className=" text-[36px] lg:text-[48px]">{t(title)}</span>
        <Skeleton className="!w-[200px] !h-[200px] md:!w-[300px] md:!h-[300px] !rounded-[10px]" />
        <div className="flex flex-col items-center justify-center gap-1 w-full">
          <Skeleton width="90%" />
          <Skeleton width="80%" />
        </div>
      </div>
      {button && <Skeleton width="100%" height="50px" />}
    </div>
  );
};

export default Payment_Ticket_Card;
