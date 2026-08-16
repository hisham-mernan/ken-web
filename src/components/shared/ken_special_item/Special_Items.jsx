import React, { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";
import { Skeleton } from "primereact/skeleton";
import Button from "../Button";
import { SarBlackIcon } from "../../../assets/images/Image";
import { currentLanguageCode } from "../../../utils/switchLang";

import { API } from "../../../service/apiUrl";
import Counter from "../counter/Counter";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import Paginated_Slider from "../slider/Paginated_Slider";
import usePaginatedData from "./../../../hooks/usePaginatedData";

import { getImageUrl, IMG } from "../../../utils/getImageUrl";
const Special_Items = ({ setSpecial, special, isConfirm = false, id }) => {
  const { t } = useTranslation();

  const [temp, setTemp] = useState([]);
  const { data, page, pages, handlePagination, loading } = usePaginatedData(
    `${API.huts.details.special_item}${id}/`
  );

  useEffect(() => {
    if (special) {
      setTemp(special);
    }
  }, [special]);
  if (data?.length === 0) return null;

  return (
    <section
      className={`${
        data?.length < 4 ? "special_item" : ""
      } Container flex flex-col gap-10`}
    >
      <h2 className="text-secondary headline_lg !font-bold">
        {t("special_item_title")}
      </h2>

      <Paginated_Slider
        page={page}
        pages={pages}
        handlePagination={handlePagination}
        containerClassName=" !gap-4 sm:!gap-8 2xl:!gap-[110px]"
        loading={loading}
        loaderArrayLength={4}
        SkeletonComponent={Box_Skeleton}
      >
        <Box
          temp={temp}
          setTemp={setTemp}
          data={data}
          special={special}
          setSpecial={setSpecial}
          loading={loading}
          isConfirm={isConfirm}
        />
      </Paginated_Slider>
    </section>
  );
};
const Box = ({
  data,
  setSpecial,
  special,
  setTemp,
  temp,
  isConfirm,
  loading,
}) => {
  const { t } = useTranslation();
  const [error, setError] = useState([]);
  const [justAddedIds, setJustAddedIds] = useState([]);

  const handleChangeTicket = (value, item) => {
    setTemp((prev) => {
      let list = [...prev];
      const exist = list.find((data) => data.item === item.id);
      if (exist) {
        list = list.map((data) =>
          data.item === item.id
            ? { ...data, quantity: value, price: item?.price }
            : data
        );
      } else {
        list.push({ item: item.id, quantity: value, price: item?.price });
      }
      return list;
    });
  };

  const addToTicket = (data) => {
    if (temp?.length > 0) {
      const item = temp.find((t) => t.item === data?.id);
      if (!item) return;

      if (item.quantity === 0) {
        setSpecial((pre) => pre.filter((d) => d.item !== item.item));
        return;
      }

      if (item.quantity < data.min_purchasable_quantity) {
        setError((pre) => {
          if (Array.isArray(pre) && !pre.includes(item.item)) {
            toast.error(
              t("min_quantity_error", {
                item: currentLanguageCode === "en" ? data.title : data.title_ar,
                min: data.min_purchasable_quantity,
              })
            );
            return [...pre, item.item];
          }
          return pre;
        });
        return;
      } else {
        setError((pre) => {
          if (Array.isArray(pre)) {
            return pre.filter((id) => id !== item.item);
          }
          return pre;
        });

        setSpecial((pre) => {
          const exists = pre.find((d) => d.item === item.item);
          if (exists) {
            return pre.map((d) => (d.item === item.item ? item : d));
          } else {
            return [...pre, item];
          }
        });

        setJustAddedIds((prev) => [...prev, item.item]);
        setTimeout(() => {
          setJustAddedIds((prev) => prev.filter((id) => id !== item.item));
        }, 1000);
      }
    }
  };
  return (
    <>
      {data?.map((item) => {
        const currentQuantity =
          special?.find((s) => s?.item === item.id)?.quantity || 0;
        const tempItem = temp.find((t) => t.item === item.id);

        const tempQuantity = tempItem ? tempItem.quantity : 0;

        const isJustAdded = justAddedIds.includes(item.id);
        return (
          <div
            key={item.id}
            className={` bg-amber-50 outline-none w-[250px] sm:w-[200px] shrink-0 secondary_border ${
              error.includes(item.id) ? "!border-red-dark" : ""
            }`}
          >
            <img loading="lazy" decoding="async"
              src={getImageUrl(item?.image, { width: IMG.thumb })}
              alt="special item image"
              className="w-full sm:w-[200px] h-[190px] sm:h-[150px] rounded-[10px] object-cover object-center"
            />
            <div className="flex flex-col gap-2.5 py-5 px-4">
              <h3 className="text-[#202020] text-sm font-semibold line-clamp-2">
                {currentLanguageCode === "en" ? item?.title : item?.title_ar}
              </h3>
              <div className="flex_center_y justify-between gap-1">
                <figure className="flex_center_y font-semibold text-sm text-secondary-dark gap-1">
                  <img loading="lazy" decoding="async" src={SarBlackIcon} alt="sar" className="w-3.5 h-3.5" />
                  <span>{item?.price}</span>
                </figure>
                <Counter
                  disabled={loading}
                  max={item?.max_purchasable_quantity}
                  min={item?.min_purchasable_quantity}
                  value={tempQuantity}
                  handleChange={(e) => handleChangeTicket(e, item)}
                />
              </div>

              <Button
                textSize="base"
                type="primary_light"
                className="font-semibold"
                onClick={() => addToTicket(item)}
                disabled={tempQuantity > item?.max_purchasable_quantity}
              >
                {tempQuantity === 0 && currentQuantity > 0
                  ? t("remove_ticket")
                  : isJustAdded
                  ? t("added")
                  : t("add_to_ticket")}
              </Button>
            </div>
          </div>
        );
      })}
    </>
  );
};
const Box_Skeleton = () => {
  return (
    <div className="w-[300] sm:w-[200px] min-w-[180px] sm:min-w-[200px] flex-shrink-0">
      <Skeleton className="!w-full sm:!w-[200px] !h-[180px] sm:!h-[150px] !rounded-[10px]" />
      <div className="flex flex-col gap-2.5 py-5 px-4">
        <Skeleton width="100%" height="1rem" />
        <Skeleton width="60%" height="1rem" />
        <Skeleton width="100%" height="2.5rem" className="rounded-md" />
      </div>
    </div>
  );
};
export default Special_Items;
