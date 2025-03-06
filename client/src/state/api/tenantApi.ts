import { baseApi } from "./baseApi";
import { Tenant, TenantRegistrationData } from "../types/tenant/tenant.types";

export const tenantApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createTenant: build.mutation<{ tenant: Tenant; message: string }, TenantRegistrationData>({
      query: (tenantData) => ({
        url: "/tenants/create",
        method: "POST",
        body: tenantData,
      }),
      invalidatesTags: ["Auth", "Tenant"],
      transformErrorResponse: (response, meta) => {
        console.error("Create tenant error:", response);
        return response;
      },
    }),

    getTenantDetails: build.query<{ tenant: Tenant }, void>({
      query: () => "/tenants/details",
      providesTags: ["Auth", "Tenant"],
      transformResponse: (response: { tenant: Tenant }) => {
        console.log("Tenant details fetched successfully:", response);
        return response;
      },
      transformErrorResponse: (response, meta) => {
        console.error("Get tenant details error:", response);
        return response;
      },
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          console.log("Starting tenant details query");
          const { data } = await queryFulfilled;
          console.log("Tenant details query fulfilled:", data);
        } catch (error) {
          console.error("Tenant details query failed:", error);
        }
      },
    }),

    updateTenant: build.mutation<{ tenant: Tenant; message: string }, Partial<TenantRegistrationData>>({
      query: (tenantUpdate) => ({
        url: "/tenants/update",
        method: "PUT",
        body: tenantUpdate,
      }),
      invalidatesTags: ["Auth", "Tenant"],
      transformErrorResponse: (response, meta) => {
        console.error("Update tenant error:", response);
        return response;
      },
    }),
  }),
});

export const {
  useCreateTenantMutation,
  useGetTenantDetailsQuery,
  useUpdateTenantMutation,
} = tenantApi; 