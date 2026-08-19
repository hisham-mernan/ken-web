import React from "react";

import Discover_Triptych from "./components/Discover_Triptych";

// hooks
import useGetData from "../../../hooks/useGetData";

// services
import { API } from "../../../service/apiUrl";

/**
 * Owns the huts request; the layout lives in Discover_Triptych, which is the
 * Ken design system's treatment of this section. Same endpoint and same data
 * as the carousel it replaces.
 */
const Discover = () => {
  const { data, loading } = useGetData(API.home.huts);
  return <Discover_Triptych data={data} loading={loading} />;
};

export default Discover;
