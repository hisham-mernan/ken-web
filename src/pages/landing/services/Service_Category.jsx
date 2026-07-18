import React, { useEffect, useState } from "react";
import Slider from "react-slick";

import Service_Item from "../../../components/shared/services/Service_Item";
import usePaginatedData from "../../../hooks/usePaginatedData";
import { currentLanguageCode } from "../../../utils/switchLang";
import { API } from "../../../service/apiUrl";
import Pagination from "../../../components/shared/pagination/Pagination";
import axiosInstance from "../../../service/axiosInstance";
import { handleErrors } from "../../../utils/handleError";
import { Skeleton } from "primereact/skeleton";
import Landing_Header from "../../../components/layout/header/Landing_Header";

const Service_Category = () => {
  const {
    data: suppliers,
    loading: loadingSuppliers,
    page: supplierPage,
    pages: supplierPages,
    handlePagination,
  } = usePaginatedData(API.services);

  const [servicesMap, setServicesMap] = useState({});

  useEffect(() => {
    if (!suppliers) return;
    const initialMap = {};
    suppliers.forEach((supplier) => {
      initialMap[supplier.id] = {
        pages: { [supplier.services.page]: supplier.services.results },
        currentPage: supplier.services.page,
        page: supplier.services.page,
        num_pages: supplier.services.num_pages,
      };
    });
    setServicesMap(initialMap);
  }, [suppliers]);

  const getServicePage = async (supplierId, page) => {
    const current = servicesMap[supplierId];
    const existingPage = current.pages[page];
    if (existingPage) {
      setServicesMap((prev) => ({
        ...prev,
        [supplierId]: {
          ...prev[supplierId],
          currentPage: page,
        },
      }));
    } else {
      try {
        const url = `${API.services}?page=1&services_page=${page}&supplier_id=${supplierId}`;
        const res = await axiosInstance.get(url);
        const results = res.data.results?.[0]?.services;
        if (res.status === 200) {
          setServicesMap((prev) => ({
            ...prev,
            [supplierId]: {
              ...prev[supplierId],
              pages: {
                ...prev[supplierId].pages,
                [page]: results?.results || [],
              },
              currentPage: page,
              page: results?.page,
              num_pages: results?.num_pages,
            },
          }));
        }
      } catch (err) {
        handleErrors(err, null, t);
      }
    }
  };

  return (
    <section className="flex flex-col gap-14 xl:gap-[100px] ">
      {loadingSuppliers
        ? Array.from({ length: 4 }).map((_, idx) => (
            <ServiceSkeleton key={idx} />
          ))
        : suppliers?.map((supplier) => {
            const servicesData = servicesMap[supplier.id];
            if (!servicesData) return null;

            const currentPageServices =
              servicesData.pages[servicesData.currentPage] || [];

            return (
              <section
                className="Container flex flex-col gap-5 md:gap-7"
                key={supplier.id}
              >
                <Landing_Header title={supplier.full_name} />

                <div className="relative">
                  <Slider
                    {...{
                      dots: false,
                      rtl: currentLanguageCode !== "en",
                      infinite: false,
                      speed: 500,
                      slidesToShow: 1, // show one grid per slide
                      slidesToScroll: 1,
                      arrows: false,
                    }}
                  >
                    {Array.from({
                      length: Math.ceil(currentPageServices.length / 4),
                    }).map((_, index) => {
                      const group = currentPageServices.slice(
                        index * 4,
                        index * 4 + 4
                      );
                      return (
                        <div key={index}>
                          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-[380px_1fr_1fr_1fr] gap-5 xl:gap-7">
                            {group.map((service) => (
                              <Service_Item key={service.id} data={service} />
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </Slider>
                  {servicesData.currentPage > 1 && (
                    <div className="flex justify-center mt-4">
                      <Pagination
                        currentPage={servicesData.currentPage}
                        totalCount={servicesData.num_pages}
                        onPageChange={(page) =>
                          getServicePage(supplier.id, page)
                        }
                      />
                    </div>
                  )}
                </div>
              </section>
            );
          })}

      {supplierPage > 1 && suppliers?.length > 0 && (
        <Pagination
          currentPage={supplierPage}
          totalCount={supplierPages}
          onPageChange={handlePagination}
        />
      )}
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
export default Service_Category;
