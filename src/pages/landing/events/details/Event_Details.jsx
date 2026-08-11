import React, { useMemo } from "react";

// lib
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";
import { Skeleton } from "primereact/skeleton";
import { useNavigate, useParams } from "react-router-dom";

// components
import Button from "../../../../components/shared/Button";
import List from "../../../../components/shared/list/List";
import Right_Text_Header from "../../../../components/layout/header/Right_Text_Header";

// hooks
import useGetData from "../../../../hooks/useGetData";

// assets
import { SarBlackIcon } from "../../../../assets/images/Image";
import Content from "../../huts/huts_details/components/Content";
import {
  CalendarIcon2,
  HomeIcon,
  UserTag,
} from "../../../../assets/icons/Icon";

// service
import { API } from "../../../../service/apiUrl";
import { getImageUrl } from "../../../../utils/getImageUrl";

// utils
import { currentLanguageCode } from "../../../../utils/switchLang";

// context
import { useAuth } from "../../../../context/Auth_Context";
import Page_Nout_Found from "../../404/Page_Nout_Found";
import Landing_Header from "../../../../components/layout/header/Landing_Header";

const Event_Details = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const { token } = useAuth();
  const navigate = useNavigate();
  const {
    data,
    loading: loadingData,
    error,
  } = useGetData(`${API.events_page.details}${id}/`);

  // __________________ formater
  const iconList = [
    {
      icon: <UserTag fill="var(--color-primary-3)" width="44" height="44" />,
      value: data?.available_dates?.capacity
        ? `${data?.available_dates?.capacity} ${t("person")}`
        : "-",
    },
    {
      icon: (
        <CalendarIcon2 fill="var(--color-primary-3)" width="44" height="44" />
      ),
      value: data?.available_dates?.date ?? "-",
    },
    {
      icon: <HomeIcon fill="var(--color-primary-3)" width="44" height="44" />,
      value:
        currentLanguageCode === "en"
          ? data?.hut?.title ?? "-"
          : data?.hut?.title_ar ?? "",
    },
  ];

  const detailsList = useMemo(() => {
    return [
      {
        title: t("activities"),
        items: Array.isArray(data?.includes) ? data.includes : [],
        variant: "icon",
      },
      {
        title: t("notes"),
        subTitle: "what_you_will_do",
        items: Array.isArray(data?.notes) ? data.notes : [],
        variant: "list",
      },
    ];
  }, [data]);

  if (error?.detail === "No Event matches the given query.") {
    return (
      <Page_Nout_Found
        text="event_not_found"
        btnLink="/event"
        btnName="back_to_events"
      />
    );
  }
  return (
    <section className="Container flex flex-col gap-10 md:gap-20">
      <Landing_Header
        src="xl"
        title={currentLanguageCode === "en" ? data?.title : data?.title_ar}
      />
      {loadingData ? (
        <Details_Skeleton />
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 2xl:gap-14">
          {/* left content */}
          <div className="order-2 md:order-1 md:max-w-[407px] flex flex-col gap-10 xl:gap-[60px] ">
            {/* price */}
            <header className="flex_center_y">
              <img src={SarBlackIcon} alt="sar" className="w-[30px] h-[30px]" />
              <strong className="headline_lg !font-bold text-secondary ">
                {data?.available_dates?.price}
                <small className="title_lg !font-normal">/{t("_person")}</small>
              </strong>
            </header>
            {/* description */}
            <div className="text-primary-3 body_lg flex flex-col gap-4">
              {currentLanguageCode === "en"
                ? data?.description ?? "-"
                : data?.description_ar ?? "-"}
            </div>
            {/* details */}
            <div className="flex justify-between xs:justify-start gap-8 md:gap-11">
              {iconList?.map((item, idx) => (
                <div key={idx} className="flex flex-col gap-3.5">
                  {item?.icon}
                  <span className="title_lg text-primary-3">{item?.value}</span>
                </div>
              ))}
            </div>
          </div>
          <figure
            className={`order-1 md:order-2 w-full max-w-[690px] rounded-lg h-[330px] border border-font-light ${
              data?.image ? "relative main_gradient" : ""
            } `}
          >
            {data?.image ? (
              <img
                src={getImageUrl(data?.image)}
                alt="event image"
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <span className="w-full h-full bg-gray-50 flex rounded-lg" />
            )}
          </figure>
        </section>
      )}
      {/* activity */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 2xl:gap-14">
        {detailsList?.map((item, index) => (
          <List
            key={index}
            title={item?.title}
            list={item?.items ?? []}
            subTitle={item?.subTitle}
            variant={item?.variant}
            loading={loadingData}
          />
        ))}
      </section>

      <Button
        onClick={() => {
          if (!token) {
            toast.error(t("login_first"));
            Cookies.set("from_details", data?.hut?.id);
            navigate("/account/login");
          } else {
            navigate(`/huts/${data?.hut?.id}/details`);
          }
        }}
      >
        {" "}
        {t("book_now")}
      </Button>
    </section>
  );
};

const Details_Skeleton = () => {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 2xl:gap-14">
      {/* left content */}
      <div className="order-2 md:order-1 w-full  flex flex-col gap-10 xlgap-[60px] ">
        {/* price */}
        <div className="flex items-center gap-2">
          <Skeleton shape="circle" width="30px" height="30px" />
          <Skeleton width="120px" height="2rem" />
        </div>
        {/* description */}
        <div className="text-primary-3 body_lg flex flex-col gap-1">
          <Skeleton width="50%" height="1rem" />
          <Skeleton width="60%" height="1rem" />
          <Skeleton width="80%" height="1rem" />
        </div>
        {/* details */}
        <div className=" flex justify-between xs:justify-start gap-8 md:gap-11">
          {Array.from({ length: 3 })?.map((_, idx) => (
            <div key={idx} className="flex flex-col gap-3.5">
              <Skeleton width="44px" height="44px" />

              <Skeleton width="80px" />
            </div>
          ))}
        </div>
      </div>
      <figure
        className={`order-1 md:order-2 w-full max-w-[690px] rounded-lg h-[330px]  `}
      >
        <Skeleton width="100%" height="330px" className="rounded-lg" />
      </figure>
    </section>
  );
};
export default Event_Details;
