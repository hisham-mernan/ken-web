import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import Service_Item from "../../../../../components/shared/services/Service_Item";
import Button from "../../../../../components/shared/Button";
import { Skeleton } from "primereact/skeleton";

import { currentLanguageCode } from "../../../../../utils/switchLang";
import Slider from "react-slick";
import { toast } from "react-toastify";
import Page_Nout_Found from "../../../404/Page_Nout_Found";
import Empty from "../../../../../components/shared/empty/Empty";
import { InboxEmpty } from "../../../../../assets/images/Image";

const Add_Services = ({
  data,
  loading,
  ticket,
  setTicket,
  noAvailableService,
}) => {
  const { t } = useTranslation();
  const [temp, setTemp] = useState([]);
  const [error, setError] = useState([]);
  const [justAddedIds, setJustAddedIds] = useState([]);

  const handleChangeTicket = (value, serviceId, price, date) => {
    setTemp((prev) => {
      let list = [...prev];
      const exist = list.find((ls) => ls.service === serviceId);
      if (exist) {
        list = list.map((ls) =>
          ls.service === serviceId ? { ...ls, quantity: value, price } : ls
        );
      } else {
        list.push({ service: serviceId, quantity: value, price, date: date });
      }
      return list;
    });
  };

  const addToTicket = (data) => {
    if (temp?.length > 0) {
      const item = temp.find((t) => t.service === data?.id);
      if (!item) return;

      if (item.quantity === 0) {
        setTicket((pre) => pre.filter((d) => d.service !== item.service));
        return;
      }

      if (item.quantity < data.min_purchasable_quantity) {
        setError((pre) => {
          if (Array.isArray(pre) && !pre.includes(item.service)) {
            toast.error(
              t("min_quantity_error", {
                item: currentLanguageCode === "en" ? data.title : data.title_ar,
                min: data.min_purchasable_quantity,
              })
            );
            return [...pre, item.service];
          }
          return pre;
        });
        return;
      } else {
        setError((pre) => {
          if (Array.isArray(pre)) {
            return pre.filter((id) => id !== item.service);
          }
          return pre;
        });

        setTicket((pre) => {
          const exists = pre.find((d) => d.service === item.service);
          if (exists) {
            return pre.map((d) => (d.service === item.service ? item : d));
          } else {
            return [...pre, item];
          }
        });

        setJustAddedIds((prev) => [...prev, item.service]);
        setTimeout(() => {
          setJustAddedIds((prev) => prev.filter((id) => id !== item.service));
        }, 1000);
      }
    }
  };
  useEffect(() => {
    setTemp(ticket);
  }, [ticket]);
  if (noAvailableService) {
    return (
      <div className="Container flex flex-col">
        <Empty img={InboxEmpty} text="no_available_service" />
      </div>
    );
  }
  if (data?.length === 0) return null;
  return (
    <section className="Container flex flex-col gap-5 md:gap-11 w-full">
      <h2 className="headline_lg !font-bold text-secondary">
        {t("add_extra_product")}
      </h2>
      <div>
        {loading ? (
          Array.from({ length: 4 }).map((_, idx) => (
            <ServiceSkeleton key={idx} />
          ))
        ) : (
          <Slider
            {...{
              dots: true,
              rtl: currentLanguageCode !== "en",
              infinite: false,
              speed: 500,
              slidesToShow: 1,
              slidesToScroll: 1,
              arrows: true,
            }}
          >
            {Array.from({ length: Math.ceil(data.length / 4) }).map(
              (_, index) => {
                const group = data.slice(index * 4, index * 4 + 4);

                return (
                  <div key={index}>
                    <div
                      className={`grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-[380px_1fr_1fr_1fr] gap-5 xl:gap-7 `}
                    >
                      {group.map((item) => {
                        const currentTempItem = temp.find(
                          (t) => t.service === item.id
                        );
                        const currentTicketItem = ticket.find(
                          (t) => t.service === item.id
                        );

                        const currentQuantity =
                          currentTempItem?.quantity ??
                          currentTicketItem?.quantity ??
                          0;

                        const wasInTicket = currentTicketItem?.quantity > 0;
                        const changedToZero =
                          wasInTicket && currentQuantity === 0;
                        return (
                          <Service_Item
                            key={item.id}
                            data={item}
                            className="dark"
                            hasCounter={true}
                            currentQuantity={currentQuantity}
                            handleChangeTicket={handleChangeTicket}
                          >
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
                          </Service_Item>
                        );
                      })}
                    </div>
                  </div>
                );
              }
            )}
          </Slider>
        )}
      </div>
    </section>
  );
};
const ServiceSkeleton = () => {
  return (
    <div className=" bg-gray-50 z-10 h-[490px] xs:h-[420px] sm:h-[506px] rounded-lg relative overflow-hidden">
      {/* Content overlay */}
      <div className="absolute bottom-[25px] w-[90%] left-1/2 -translate-x-1/2 z-10 flex flex-col gap-2">
        {/* Title */}
        <Skeleton
          width="70%"
          height="1.5rem"
          className="rounded-md !bg-gray-200"
        />
        {/* Description (3 lines) */}
        <Skeleton width="100%" height="1rem" className="rounded !bg-gray-200" />
        <Skeleton width="90%" height="1rem" className="rounded !bg-gray-200" />
        <Skeleton width="80%" height="1rem" className="rounded !bg-gray-200" />
        <Skeleton width="100%" height="56px" className="!bg-gray-200" />
      </div>
    </div>
  );
};
export default Add_Services;
