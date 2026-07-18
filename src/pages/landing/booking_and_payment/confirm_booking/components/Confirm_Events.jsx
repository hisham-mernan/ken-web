import React, { useEffect, useState } from "react";

import Slider from "react-slick";
import Event_Item from "../../../../../components/shared/events/Event_Item";
import { useTranslation } from "react-i18next";
import Button from "../../../../../components/shared/Button";

import { Skeleton } from "primereact/skeleton";
import { currentLanguageCode } from "../../../../../utils/switchLang";
import { toast } from "react-toastify";

const Confirm_Events = ({ ticket, setTicket, data, loading }) => {
  const [temp, setTemp] = useState([]);
  const [error, setError] = useState([]);
  const [justAddedIds, setJustAddedIds] = useState([]);

  const { t } = useTranslation();
  const handleChangeTicket = (value, eventId, price, date) => {
    setTemp((prev) => {
      let list = [...prev];

      const exist = list.find((ls) => ls.event === eventId);
      if (exist) {
        list = list.map((ls) =>
          ls.event === eventId ? { ...ls, quantity: value, price } : ls
        );
      } else {
        list.push({ event: eventId, quantity: value, price, date: date });
      }
      return list;
    });
  };

  const addToTicket = (data) => {
    if (temp?.length > 0) {
      const item = temp.find((t) => t.event === data?.id);
      if (!item) return;

      if (item.quantity === 0) {
        setTicket((pre) => pre.filter((d) => d.event !== item.event));
        return;
      }

      if (item.quantity < data.min_purchasable_quantity) {
        setError((pre) => {
          if (Array.isArray(pre) && !pre.includes(item.event)) {
            toast.error(
              t("min_quantity_error", {
                item: currentLanguageCode === "en" ? data.title : data.title_ar,
                min: data.min_purchasable_quantity,
              })
            );
            return [...pre, item.event];
          }
          return pre;
        });
        return;
      } else {
        setError((pre) => {
          if (Array.isArray(pre)) {
            return pre.filter((id) => id !== item.event);
          }
          return pre;
        });

        setTicket((pre) => {
          const exists = pre.find((d) => d.event === item.event);
          if (exists) {
            return pre.map((d) => (d.event === item.event ? item : d));
          } else {
            return [...pre, item];
          }
        });

        setJustAddedIds((prev) => [...prev, item.event]);
        setTimeout(() => {
          setJustAddedIds((prev) => prev.filter((id) => id !== item.event));
        }, 1000);
      }
    }
  };
  useEffect(() => {
    setTemp(ticket);
  }, [ticket]);
  // const handleAddedToTicket = (ticket) => {
  //   const exist = events?.find((item) => item?.event === ticket?.id);
  //   if (exist) {
  //     setEvents((pre) => pre?.filter((item) => item?.event !== ticket?.id));
  //   } else {
  //     setEvents((pre) => [
  //       ...pre,
  //       {
  //         event: ticket?.id,
  //         quantity: 1,
  //         price: ticket?.price,
  //         date: ticket?.available_dates?.date,
  //       },
  //     ]);
  //   }
  // };
  if (data?.length === 0) return null;

  return (
    <section className="Container flex flex-col gap-5 md:gap-11 w-full">
      <h2 className="headline_lg !font-bold text-secondary">
        {t("dont_miss_event")}
      </h2>
      {loading ? (
        <EventSkeleton />
      ) : (
        <Slider
          {...{
            dots: true,
            rtl: currentLanguageCode === "en" ? false : true,
            infinite: false,
            speed: 3000,
            cssEase: "linear",
            slidesToShow: 1,
            slidesToScroll: 1,
          }}
        >
          {data?.map((item) => {
            const currentTempItem = temp.find((t) => t.service === item.id);
            const currentTicketItem = ticket.find((t) => t.service === item.id);

            const currentQuantity =
              currentTempItem?.quantity ?? currentTicketItem?.quantity ?? 0;

            const wasInTicket = currentTicketItem?.quantity > 0;
            const changedToZero = wasInTicket && currentQuantity === 0;
            return (
              <Event_Item
                item={item}
                key={item.id}
                hasCounter={true}
                loading={loading}
                currentQuantity={currentQuantity}
                handleChangeTicket={handleChangeTicket}
                insideButton={() => (
                  <Button
                    type="primary_light"
                    onClick={() => addToTicket(item)}
                  >
                    {changedToZero
                      ? t("remove_ticket")
                      : justAddedIds.includes(item?.id)
                      ? t("added")
                      : t("add_to_ticket")}
                  </Button>
                )}
              />
            );
          })}
        </Slider>
      )}
    </section>
  );
};
const EventSkeleton = () => {
  return (
    <div className=" bg-gray-50 relative rounded-lg h-[250px] sm:h-[300px] lg:h-[426px] overflow-hidden">
      {/* Overlay content */}
      <div className="absolute bottom-3 md:bottom-[40px] w-[calc(100%_-_24px)] md:w-[calc(100%_-_80px)] left-1/2 -translate-x-1/2 px-3 md:px-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 z-10">
        <div className="flex flex-col gap-2 w-full max-w-[342px]">
          {/* Calendar + Location */}
          <div className="flex items-center gap-4">
            <Skeleton width="80px" height=".8rem" className="!bg-gray-200" />
            <Skeleton width="100px" height=".8rem" className="!bg-gray-200" />
          </div>
          {/* Title */}
          <Skeleton width="70%" height="1rem" className="!bg-gray-200" />
          {/* Description */}
          <div className="flex flex-col gap-2">
            <Skeleton width="100%" height=".8rem" className="!bg-gray-200" />
            <Skeleton width="90%" height=".8rem" className="!bg-gray-200" />
            <Skeleton width="80%" height=".8rem" className="!bg-gray-200" />
          </div>
          <Skeleton width="100%" height="56px" className="!bg-gray-200" />
        </div>
      </div>
    </div>
  );
};

export default Confirm_Events;
