// components
import Booking_Contact from "./components/Booking_Contact";
import Special_Landing_Header from "../../../components/layout/header/Special_Landing_Header";

// hooks
import useGetData from "../../../hooks/useGetData";
import usePaginatedData from "../../../hooks/usePaginatedData";

// services
import { API } from "../../../service/apiUrl";
import { useTranslation } from "react-i18next";
import { InboxEmpty } from "../../../assets/images/Image";
import Booking_Card_Layout from "./components/Booking_Card_Layout";
import Pagination from "../../../components/shared/pagination/Pagination";
import Booking_Buttons from "./components/Booking_Buttons";
import { Skeleton } from "primereact/skeleton";
import Landing_Header from "../../../components/layout/header/Landing_Header";

const User_Booking = () => {
  const { t } = useTranslation();
  const { data: upcoming, loading: upcomingLoading } = useGetData(
    API.user_booking.upcoming
  );
  const {
    data: pastBooking,
    loading: pastBookingLoading,
    page,
    pages,
    handlePagination,
  } = usePaginatedData(API.user_booking.past);

  if (
    !upcomingLoading &&
    !pastBookingLoading &&
    (!upcoming || Object.keys(upcoming).length === 0) &&
    pastBooking?.length === 0
  )
    return (
      <section className="Container layout_bg page_p pb-10 lg:pb-[134px] flex flex-col gap-5 md:gap-10 xl:gap-20">
        <section className="flex flex-col gap-5 md:gap-10 ">
          <h2 className="text-secondary text-xl md:text-2xl lg:text-3xl  xl:text-[32px] !font-bold">
            {t("upcoming_appointments")}
          </h2>
          <div className="secondary_border flex flex-col items-center justify-center text-center gap-8 py-[100px] px-4 sm:px-8 md:px-10 lg:px-20 xl:px-[120px]">
            <h3 className=" text-[28px] xs:text-[35px] md:text-[48px] text-secondary-dark ">
              {t("we_are_exciting_see_soon")}
            </h3>
            <img loading="lazy" decoding="async"
              src={InboxEmpty}
              alt="don't have upcoming appointments"
              className="max-w-[300px] md:max-w-[400px]"
            />
            <p className="text-[#808080] text-sm sm:text-base md:text-lg lg:text-xl ">
              {t("no_upcoming_appointment")}
            </p>
          </div>
        </section>
      </section>
    );

  return (
    <>
      <section className="layout_bg page_p pb-10 lg:pb-[134px] flex flex-col gap-5 md:gap-10 xl:gap-20">
        <Landing_Header title="my_booking" />

        <section className="Container flex flex-col gap-5 md:gap-10 xl:gap-20">
          <Booking_Contact />
          {upcomingLoading || pastBookingLoading ? (
            <section className="secondary_border ticket_card gap-7  xl:gap-10">
              <div className="flex flex-col gap-10">
                <header>
                  <Skeleton width="150px" />
                </header>
                <div className="grid grid-cols-1 md:grid-cols-2  content-baseline gap-6">
                  <Skeleton height="204px" />
                  <Skeleton height="204px" />
                </div>
                <div className="flex items-center justify-between gap-2">
                  <Skeleton width="150px" />
                  <Skeleton width="150px" />
                </div>
              </div>
              <div className="h-[1px] bg-secondary-light w-full" />
              <div className="flex flex-col xs:flex-row items-center gap-3 sm:gap-5 justify-between">
                <Skeleton className=" !rounded-full !h-[48px] 2xl:!h-[54px] !w-full sm:!max-w-[400px]" />
                <Skeleton className=" !rounded-full !h-[48px] 2xl:!h-[54px] !w-full sm:!max-w-[400px]" />
                <Skeleton className=" !rounded-full !h-[48px] 2xl:!h-[54px] !w-full sm:!max-w-[280px]" />
              </div>
            </section>
          ) : (
            upcoming && (
              <>
                {Object.keys(upcoming).length !== 0 && (
                  <section className="flex flex-col  gap-10 xl:gap-20">
                    <Booking_Card_Layout
                      title="upcoming_appointments"
                      data={upcoming}
                      loading={upcomingLoading}
                      isUpcoming={true}
                    />
                    <Booking_Buttons
                      id={upcoming?.id}
                      available_dates={upcoming?.available_dates}
                    />
                  </section>
                )}

                {pastBooking?.length > 0 && (
                  <section className="flex flex-col  gap-10 xl:gap-20">
                    <Booking_Card_Layout
                      title="past_appointments"
                      data={pastBooking}
                      loading={pastBookingLoading}
                      isUpcoming={false}
                    />
                    <Pagination
                      currentPage={page}
                      totalCount={pages}
                      onPageChange={handlePagination}
                    />
                  </section>
                )}
              </>
            )
          )}

          {/* upcoming */}
        </section>
      </section>
    </>
  );
};

export default User_Booking;
