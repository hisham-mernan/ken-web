import React from "react";
import { useTranslation } from "react-i18next";

import List from "../../../../../components/shared/list/List";

const Activity = ({ loading, data }) => {
  const { t } = useTranslation();
  const detailsList = [
    {
      title: t("activities"),
      subTitle: "what_you_will_do",
      items: data?.activities,
      variant: "list",
    },
    {
      title: t("main_services"),
      items: data?.main_services,
      variant: "icon",
    },
    {
      title: t("extra_services"),
      items: data?.extra_services,
      variant: "icon",
    },
  ];
  return (
    <section className=" grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr]  2xl:grid-cols-[492px_auto_auto] gap-3 sm:gap-6 lg:gap-10 2xl:gap-[55px] ">
      {detailsList?.map((item, index) => (
        <List
          key={index}
          title={item.title}
          list={item.items}
          subTitle={item?.subTitle}
          variant={item?.variant}
          loading={loading}
        />
      ))}
    </section>
  );
};

export default Activity;
