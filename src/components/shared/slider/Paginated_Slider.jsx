import React from "react";
import Slider from "./Slider";
import Pagination from "../pagination/Pagination";

const Paginated_Slider = ({
  children,
  containerClassName,
  page,
  pages,
  handlePagination,
  loading,
  SkeletonComponent,
  loaderArrayLength = 4,
}) => {
  return (
    <section className="flex flex-col gap-10">
      <Slider containerClassName={containerClassName} loading={loading}>
        {children}
      </Slider>
      <Pagination
        currentPage={page}
        totalCount={pages}
        onPageChange={handlePagination}
      />
      {/* <div className="flex_center gap-2 flex-wrap">
        {Array.from({ length: pages }).map((_, idx) => (
          <span
            role="button"
            onClick={() => {
              if (page !== idx + 1) {
                handlePagination(idx + 1);
              }
            }}
            key={idx}
            className={`flex_center w-2.5 h-2.5 border border-primary-4 rounded-full ${
              page === idx + 1
                ? "bg-primary-4"
                : " cursor-pointer bg-primary-4/10"
            }  `}
          />
        ))}
      </div> */}
    </section>
  );
};

export default Paginated_Slider;
