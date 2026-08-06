import { useEffect, useState } from "react";
import axiosInstance from "../service/axiosInstance";

// Lightweight in-memory client cache
const apiCache = new Map();

function useGetData(endpoint, setValues) {
  const cached = endpoint ? apiCache.get(endpoint) : null;
  const [data, setData] = useState(cached || []);
  const [loading, setLoading] = useState(!cached);
  const [error, setError] = useState();

  const fetchData = async () => {
    if (!endpoint) return;
    try {
      if (!apiCache.has(endpoint)) {
        setLoading(true);
      }
      const response = await axiosInstance.get(endpoint);
      const fetchedData = response.data;

      apiCache.set(endpoint, fetchedData);
      setData(fetchedData || []);
      if (setValues) {
        setValues(fetchedData);
      }
    } catch (error) {
      setError(error.response ? error.response.data : error);
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [endpoint]);

  return { data, setData, loading, fetchData, error };
}

export default useGetData;
