import React from "react";

import Hut_Item from "./Hut_Item";
import { Skeleton } from "primereact/skeleton";

import { API } from "../../../../../service/apiUrl";
import usePaginatedData from "./../../../../../hooks/usePaginatedData";
import Pagination from "./../../../../../components/shared/pagination/Pagination";

const Available_Huts = ({ ref }) => {
  const { data, loading, page, pages, handlePagination } = usePaginatedData(
    API.huts.all_huts
  );
  return (
    <section ref={ref} className="Container section_p_t main_gap ">
      {loading ? (
        <HutSkeleton />
      ) : (
        <>
          {data?.map((item) => (
            <Hut_Item data={item} key={item?.id} />
          ))}
          {page !== pages && (
            <Pagination
              currentPage={page}
              totalCount={pages}
              onPageChange={handlePagination}
            />
          )}
        </>
      )}
    </section>
  );
};
const HutSkeleton = () => {
  return (
    <section className="md:border-b border-primary-4 animate-pulse">
      {/* header */}
      <header className="flex_center_y gap-1 ">
        <div>
          <Skeleton className="!w-[100px] md:!w-[300px]" height="2rem" />
        </div>
        <div className="flex-1 h-[.5px] bg-primary-4" />
      </header>
      <div className="flex flex-col md:flex-row h-full">
        {/* thumbnail and title */}
        <div className="w-full md:w-3/8 pt-14 pb-10 border-b md:border-b-0 md:border-r border-primary-4 flex flex-col gap-8 lg:gap-12 px-4">
          <Skeleton className="!w-[95%] xl:!max-w-[453px] !h-[250px] sm:!h-[300px] md:!h-[280px] lg:!h-[320px] xl:!h-[400px] !rounded-lg" />
          <div className="space-y-3 max-w-[465px]">
            <Skeleton width="60%" height="2rem" />

            <Skeleton width="70%" height="2rem" />
          </div>
        </div>

        {/*  (images + content) */}
        <div className="pt-8 md:pt-14 pb-10 md:ps-6 flex-1 flex flex-col gap-5 md:gap-8 xl:gap-11 px-4">
          {/* Image group */}
          <div className="flex gap-3 sm:gap-5 md:gap-8 lg:gap-5 xl:gap-8">
            <Skeleton className="!w-full !h-[160px] sm:!h-[200px] lg:!h-[250px] xl:!h-[330px] !rounded-lg" />
            <Skeleton className="!w-full !h-[160px] sm:!h-[200px] lg:!h-[250px] xl:!h-[330px] !rounded-lg" />
          </div>

          {/* Content */}
          <div className="flex flex-col gap-8">
            <Skeleton width="40%" height="1.5rem" />
            <ul className="flex items-center flex-wrap gap-4 md:gap-8 xl:gap-[139px]">
              <Skeleton width="60px" height="1.25rem" />
              <Skeleton width="80px" height="1.25rem" />
              <Skeleton width="70px" height="1.25rem" />
            </ul>
            <div className="flex flex-col gap-2">
              <Skeleton width="100%" />
              <Skeleton width="90%" />
              <Skeleton width="80%" />
            </div>
            <Skeleton width="30%" height="1rem" />
            <Skeleton width="100%" height="50px" className="rounded-lg" />
          </div>
        </div>
      </div>
    </section>
  );
};
export default Available_Huts;
