import { baseApi } from "./baseApi";
import { Product, NewProduct, QueryParams } from "../types";

export const customerApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getProducts: build.query<Product[], QueryParams>({
      query: (params) => ({
        url: "/products",
        params,
      }),
      providesTags: ["Products"],
    }),

    getProduct: build.query<Product, string>({
      query: (id) => `/products/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Products", id }],
    }),

    createProduct: build.mutation<Product, NewProduct>({
      query: (newProduct) => ({
        url: "/products",
        method: "POST",
        body: newProduct,
      }),
      invalidatesTags: ["Products", "Dashboard"],
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
