import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// ✅ Use environment variable for production deployment
const API_URL = import.meta.env.VITE_APP_BASE_URL + "/api";

const baseQuery = fetchBaseQuery({ baseUrl: API_URL });

export const apiSlice = createApi({
  baseQuery,
  tagTypes: [], // Add tags if needed for cache management
  endpoints: (builder) => ({}), // Add endpoints here
});
