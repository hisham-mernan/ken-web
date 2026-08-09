import { useEffect, useState } from "react";
import axiosInstance from "../service/axiosInstance";
import { API } from "../service/apiUrl";

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

      // If combined endpoint, sync sub-caches for individual widgets
      if (endpoint === API?.home?.combined && fetchedData) {
        if (fetchedData.huts) apiCache.set(API.home.huts, fetchedData.huts);
        if (fetchedData.events) apiCache.set(API.home.event, fetchedData.events);
        if (fetchedData.services) apiCache.set(API.home.services, fetchedData.services);
        if (fetchedData.about_us) apiCache.set(API.about_section, fetchedData.about_us);
        if (fetchedData.faq) apiCache.set(API.home.faq, fetchedData.faq);
        if (fetchedData.testimonials) apiCache.set(API.testimonials, fetchedData.testimonials);
        if (fetchedData.partners) apiCache.set(API.parteners, fetchedData.partners);
      }

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
