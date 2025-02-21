import { baseApi } from "./baseApi";
import {
  DashboardMetrics,
  // ExpenseByCategorySummary, ExpenseSummary, SalesSummary
} from "../types";
// import { productApi } from "./productApi";
// import { userApi } from "./authApi";

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getDashboardMetrics: build.query<DashboardMetrics, void>({
      query: () => "/dashboard",
      providesTags: ["Dashboard"],
    }),

    //   getSalesMetrics: build.query<
    //     SalesSummary[],
    //     { startDate: string; endDate: string }
    //   >({
    //     query: (params) => ({
    //       url: "/dashboard/sales",
    //       params,
    //     }),
    //     providesTags: ["Dashboard"],
    //   }),

    //   getExpenseMetrics: build.query<
    //     ExpenseSummary[],
    //     { startDate: string; endDate: string }
    //   >({
    //     query: (params) => ({
    //       url: "/dashboard/expenses",
    //       params,
    //     }),
    //     providesTags: ["Dashboard"],
    //   }),

    //   getExpensesByCategory: build.query<
    //     ExpenseByCategorySummary[],
    //     { date: string }
    //   >({
    //     query: (params) => ({
    //       url: "/dashboard/expenses/by-category",
    //       params,
    //     }),
    //     providesTags: ["Dashboard"],
    //   }),
  }),
});

export const {
  useGetDashboardMetricsQuery,
  // useGetSalesMetricsQuery,
  // useGetExpenseMetricsQuery,
  // useGetExpensesByCategoryQuery,
} = dashboardApi;
