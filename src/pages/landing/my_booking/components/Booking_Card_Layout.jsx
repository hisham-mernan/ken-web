import React from "react";
import { useTranslation } from "react-i18next";
import Booking_Details_Card from "../../../../components/shared/booking/Booking_Details_Card";
import { bookingDataFormater } from "../utils/BookingDataFormater";

const Booking_Card_Layout = ({ title, data, isUpcoming, hideButtons }) => {
  const { t } = useTranslation();
  const list = bookingDataFormater(data);

  return (
    <section className="flex flex-col  gap-10 xl:gap-20">
      <h2 className="text-secondary text-xl md:text-2xl lg:text-3xl  xl:text-[32px] !font-bold">
        {t(title)}
      </h2>
      <div className="grid">
        {isUpcoming ? (
          <Booking_Details_Card
            data={data}
            item={data}
            list={list}
            variant="columns"
            isUpcoming={isUpcoming}
            hideButtons={hideButtons}
          />
        ) : (
          data?.map((booking, index) => (
            <Booking_Details_Card
              data={booking}
              item={booking}
              list={bookingDataFormater(booking)}
              variant="columns"
              isUpcoming={isUpcoming}
              hideButtons={hideButtons}
            />
          ))
        )}
      </div>
    </section>
  );
};

export default Booking_Card_Layout;
