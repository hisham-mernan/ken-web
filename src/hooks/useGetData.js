import { useEffect, useState } from "react";
import axiosInstance from "../service/axiosInstance";

function useGetData(endpoint, setValues) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(endpoint);
      const fetchedData = response.data;

      setData(fetchedData || []);
      if (setValues) {
        setValues(fetchedData);
      }
    } catch (error) {
      setError(error.response.data);
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
