import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import Button from "../Button";
import Modal from "../popup/Modal";
import Rate from "../../../pages/landing/my_booking/components/Rate";
import { ThanksImage } from "../../../assets/images/Image";
import { downloadFile } from "../../../utils/downloadFile";
import { getImageUrl } from "../../../utils/getImageUrl";

const titleStyles = {
  primary: "text-secondary-dark",
  secondary: "text-center text-primary-2",
};

const Booking_Details_Card = ({
  isUpcoming = false,
  className = "",
  data,
  list,
  item,
  variant = "primary",
  hideButtons,
}) => {
  const { t } = useTranslation();

  const [rateModalOpen, setRateModalOpen] = useState(false);
  const [thankYouModalOpen, setThankYouModalOpen] = useState(false);
  const [bookingId, setBookingId] = useState();

  return (
    <>
      <div
        className={`${className} secondary_border ticket_card gap-7 xl:gap-10`}
      >
        {Object.entries(list).map(([key, value]) => (
          <section key={key} className="flex flex-col gap-10">
            {key === "Extension" && (
              <div className="bg-secondary-light h-[1px] w-full" />
            )}
            {(key === "booking_details" ||
              (key === "Extension" && value !== "no_extra")) && (
              <>
                <header className="flex items-center gap-2 justify-between">
                  <h2
                    className={`flex-1  text-[25px] lg:text-[30px] ${titleStyles[variant]}`}
                  >
                    {t(key)}
                  </h2>

                  {!hideButtons &&
                    key === "booking_details" &&
                    (isUpcoming ? (
                      value?.qr_code_image && (
                        <button
                          className="cursor-pointer bg-white border border-secondary-dark w-20 h-20 flex_center rounded-lg "
                          onClick={() =>
                            downloadFile(getImageUrl(value?.qr_code_image), "ticket.png", t)
                          }
                        >
                          <img loading="lazy" decoding="async"
                            src={getImageUrl(value?.qr_code_image)}
                            alt="QR"
                            className="w-full h-full rounded-[10px] object-cover "
                          />
                        </button>
                      )
                    ) : (
                      <Button
                        onClick={() => {
                          setBookingId(item?.id);
                          setRateModalOpen(true);
                        }}
                        hasFullWidth={false}
                      >
                        {t("rate_ken")}
                      </Button>
                    ))}
                </header>
                <section className="flex flex-col gap-9">
                  <div className={`grid md:grid-cols-2 gap-6 content-baseline`}>
                    {/* order details */}
                    {value?.data?.order?.length > 0 && (
                      <div className="flex flex-col gap-8">
                        {value.data.order.map((order) => (
                          <div
                            key={order?.value}
                            className="flex_center_y gap-4 justify-between"
                          >
                            <span className="flex min-w-[120px] md:min-w-[200px] text-secondary-dark font-semibold capitalize text-base lg:text-lg">
                              {t(order?.title)}:
                            </span>
                            <div className="flex_center_y gap-1 flex-1">
                              {order?.icon && order.icon}
                              <span>{order?.value}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* for services */}
                    {value?.data?.services?.length > 0 && (
                      <div className="flex flex-col gap-6">
                        <h3 className=" text-[25px] lg:text-[30px]">
                          {t("services")}
                        </h3>
                        <div className="flex flex-col gap-8">
                          {value?.data?.services?.length > 0 &&
                            value.data.services.map((service) => (
                              <div
                                key={service?.value}
                                className="flex_center_y gap-4 justify-between"
                              >
                                <span className="flex min-w-[120px] md:min-w-[200px] text-secondary-dark font-semibold capitalize text-base lg:text-lg">
                                  {t(service?.title)}
                                </span>
                                <div className="flex_center_y gap-1 flex-1">
                                  <span>{service?.value}</span>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* subtotal */}
                  <li className="flex_center_y gap-4 justify-between">
                    <span className="flex w-2/3 text-primary-dark text-sm font-semibold">
                      {t("subtotal")}:
                    </span>
                    <span className="text-primary-dark font-extrabold text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl">
                      {key === "booking_details"
                        ? data?.total_price
                        : data?.extension_price}
                    </span>
                  </li>
                </section>
              </>
            )}
          </section>
        ))}
      </div>

      {/* rating modal */}
      <Modal open={rateModalOpen} onClose={() => setRateModalOpen(false)}>
        <Rate
          bookingId={bookingId}
          onClose={() => setRateModalOpen(false)}
          setVisible={setThankYouModalOpen}
        />
      </Modal>

      {/* thanks modal */}
      <Modal
        open={thankYouModalOpen}
        onClose={() => setThankYouModalOpen(false)}
      >
        <img loading="lazy" decoding="async"
          src={ThanksImage}
          alt="Thanks"
          className="w-[200px] h-[200px] sm:w-[250px] sm:h-[250px] md:w-[350px] md:h-[350px]"
        />
      </Modal>
    </>
  );
};

export default Booking_Details_Card;
