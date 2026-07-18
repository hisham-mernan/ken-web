import React from "react";
import Landing_Header from "../../../components/layout/header/Landing_Header";

import Event_Item from "../../../components/shared/events/Event_Item";

import { API } from "../../../service/apiUrl";
import { Skeleton } from "primereact/skeleton";
import usePaginatedData from "../../../hooks/usePaginatedData";
import Pagination from "../../../components/shared/pagination/Pagination";

const All_Events = () => {
  const { data, loading, page, pages, handlePagination } = usePaginatedData(
    API.events_page.events
  );

  if (data?.length === 0 && !loading) {
    return;
  }
  return (
    <section className="Container flex flex-col gap-10 md:gap-24 w-full">
      <Landing_Header title="events" des="services_title_des" src="events" />
      <div className="flex flex-col gap-16 xl:gap-20">
        {loading ? (
          <EventSkeleton />
        ) : (
          <div className="flex flex-col gap-16 xl:gap-20">
            <div className="flex flex-col gap-16 xl:gap-10">
              {data?.map((item) => (
                <Event_Item item={item} key={item?.id} hasBookingBtn={true} />
              ))}
            </div>
            {pages !== 1 && (
              <Pagination
                currentPage={page}
                totalCount={pages}
                onPageChange={handlePagination}
              />
            )}
          </div>
        )}
      </div>
    </section>
  );
};
const EventSkeleton = () => {
  return (
    <div className="relative bg-gray-50 rounded-lg h-[250px] sm:h-[300px] lg:h-[426px] overflow-hidden">
      {/* Overlay content */}
      <div className="absolute bottom-3 md:bottom-[40px] w-[calc(100%_-_24px)] md:w-[calc(100%_-_80px)] left-1/2 -translate-x-1/2 px-3 md:px-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 z-10">
        <div className="flex flex-col gap-2 w-full max-w-[342px]">
          {/* Calendar + Location */}
          <div className="flex items-center gap-4">
            <Skeleton width="80px" height="1rem" className="!bg-gray-200" />
            <Skeleton width="100px" height="1rem" className="!bg-gray-200" />
          </div>
          {/* Title */}
          <Skeleton width="70%" height="1.5rem" className="!bg-gray-200" />
          {/* Description */}
          <Skeleton width="100%" height="1rem" className="!bg-gray-200" />
          <Skeleton width="90%" height="1rem" className="!bg-gray-200" />
          <Skeleton width="80%" height="1rem" className="!bg-gray-200" />
        </div>

        <div className="hidden sm:block">
          <Skeleton
            width="150px"
            height="2.5rem"
            borderRadius="12px"
            className="!bg-gray-200"
          />
        </div>
      </div>
    </div>
  );
};

export default All_Events;
