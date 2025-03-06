//import { RootState } from "../store";
import { createApi, fetchBaseQuery, FetchArgs, FetchBaseQueryError, BaseQueryFn } from "@reduxjs/toolkit/query/react";

// Create a custom base query with error handling
const customBaseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  credentials: 'include',
  prepareHeaders: (headers) => {
    headers.set('Content-Type', 'application/json');
    return headers;
  },
});

// Enhanced base query with error handling
const enhancedBaseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  console.log("API Request:", typeof args === 'string' ? args : args.url);
  
  try {
    const result = await customBaseQuery(args, api, extraOptions);
    
    // Handle HTTP errors
    if (result.error) {
      console.error('API Error:', {
        status: result.error.status,
        data: result.error.data,
        url: typeof args === 'string' ? args : args.url
      });
      
      // Handle specific error codes
      if (result.error.status === 403) {
        console.error('Permission denied. Please check your authentication.');
      } else if (result.error.status === 404) {
        console.error('Resource not found:', typeof args === 'string' ? args : args.url);
      }
    } else {
      console.log("API Response:", {
        url: typeof args === 'string' ? args : args.url,
        status: 'success',
        dataPreview: result.data ? '(data received)' : '(no data)'
      });
    }
    
    return result;
  } catch (error) {
    console.error('API Request Failed:', error);
    return {
      error: {
        status: 'FETCH_ERROR',
        error: String(error)
      }
    };
  }
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: enhancedBaseQuery,
  tagTypes: ["Products", "Auth", "Dashboard", "Customers", "Tenant"],
  endpoints: () => ({}),
});
