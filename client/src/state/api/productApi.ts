import { baseApi } from "./baseApi";
import { Product, NewProduct, QueryParams } from "../types";

export const productApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getProducts: build.query<Product[], QueryParams | void>({
      query: (params) => {
        console.log("getProducts query params:", params);
        
        // If params is undefined, return all products
        if (!params) {
          return {
            url: "/products",
          };
        }

        // If params has a tenantId, fetch products for that tenant
        if ('tenantId' in params && params.tenantId) {
          console.log(`Fetching products for tenant: ${params.tenantId}`);
          return {
            url: `/products/tenant/${params.tenantId}`,
            params: 'search' in params ? { search: params.search } : {},
          };
        }

        // Otherwise, use search params if provided
        return {
          url: "/products",
          params: 'search' in params ? { search: params.search } : {},
        };
      },
      providesTags: ["Products"],
      // Add transformResponse to log successful responses
      transformResponse: (response: Product[]) => {
        console.log(`Products fetched successfully: ${response.length} products`);
        return response;
      },
      // Add transformErrorResponse to log detailed error information
      transformErrorResponse: (response) => {
        console.error("Get products error:", response);
        return response;
      },
      // Add onQueryStarted for additional debugging
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          console.log("Starting products query");
          const { data } = await queryFulfilled;
          console.log(`Products query fulfilled: ${data.length} products`);
        } catch (error) {
          console.error("Products query failed:", error);
        }
      },
    }),

    getProduct: build.query<Product, string>({
      query: (id) => `/products/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Products", id }],
    }),

    createProduct: build.mutation<Product, NewProduct & { tenantId?: string }>({
      query: (newProduct) => {
        console.log("Creating product with data:", {
          ...newProduct,
          tenantId: newProduct.tenantId || 'Not specified'
        });
        
        return {
          url: "/products/post",
          method: "POST",
          body: newProduct,
        };
      },
      invalidatesTags: ["Products", "Dashboard"],
      // Add transformErrorResponse to log detailed error information
      transformErrorResponse: (response) => {
        console.error("Create product error:", response);
        return response;
      },
    }),

    updateProduct: build.mutation<
      Product,
      Partial<Product> & Pick<Product, "productId">
    >({
      query: ({ productId, ...patch }) => ({
        url: `/products/${productId}`,
        method: "PATCH",
        body: patch,
      }),
      invalidatesTags: (_result, _error, { productId }) => [
        { type: "Products", id: productId },
        "Products",
        "Dashboard",
      ],
    }),

    deleteProduct: build.mutation<void, string>({
      query: (id) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Products", "Dashboard"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApi;