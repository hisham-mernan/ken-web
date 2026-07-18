import { useEffect, useState } from "react";
import axiosInstance from "../service/axiosInstance";

function usePaginatedData(endpoint, fetchOnEvent = false, type = "pages") {
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const [refetchData, setRefetchData] = useState();
  const [data, setData] = useState([]);

  const [query, setQuery] = useState(null);

  // scroll
  const [hasMore, setHasMore] = useState(false);

  const fetchData = async (currentPage) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(endpoint, {
        params: { page: currentPage, ...query },
      });
      console.log(response.data.pages);
      setPages(response.data.pages);
      setPage(response.data.page);
      if (currentPage >= response.data.pages) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }

      if (response.status === 200) {
        const fetchedData = response.data.data || response.data.results;
        if (Array.isArray(fetchedData)) {
          if (type === "pages") {
            setData(fetchedData);
          } else {
            setData((prevData) => {
              const allData =
                currentPage === 1
                  ? [...fetchedData]
                  : [...prevData, ...fetchedData];
              const uniqueData = allData.reduce((acc, item) => {
                if (!acc.some((existing) => existing.id === item.id)) {
                  acc.push(item);
                }
                return acc;
              }, []);
              return uniqueData;
            });
          }
        }
      }
    } catch (err) {
      // console.log("error", err.response);
    } finally {
      setLoading(false);
    }
  };
  const handlePagination = (pageNumber) => {
    fetchData(pageNumber);
  };
  useEffect(() => {
    if (!fetchOnEvent) {
      setPage(1);
      fetchData(1);
    }
  }, [fetchOnEvent]);

  useEffect(() => {
    if (refetchData || query || endpoint) {
      setPage(1);
      fetchData(1);
    }
  }, [refetchData, query, endpoint]);

  // for scroll
  const handleScroll = () => {
    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = document.documentElement.scrollTop;
    const innerHeight = window.innerHeight;

    if (innerHeight + scrollTop + 1 >= scrollHeight && !loading && hasMore) {
      const nextPage = page + 1;
      fetchData(nextPage);
      setPage((pre) => pre + 1);
    }
  };
  return {
    loading,
    hasMore,
    page,
    pages,
    fetchData,
    data,
    setData,
    setRefetchData,
    setQuery,
    query,
    handlePagination,
    handleScroll,
  };
}

export default usePaginatedData;
