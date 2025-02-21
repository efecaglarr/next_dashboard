import { baseApi } from "./baseApi";
import { User, UserCredentials } from "../types";

export const userApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<{ token: string; user: User }, UserCredentials>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),

    register: build.mutation<{ token: string; user: User }, UserCredentials>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),

    getCurrentUser: build.query<User, void>({
      query: () => "/profile",
      providesTags: ["Auth"],
    }),

    updateUser: build.mutation<User, Partial<User>>({
      query: (userUpdate) => ({
        url: "/profile",
        method: "PATCH",
        body: userUpdate,
      }),
      invalidatesTags: ["Auth"],
    }),
  }),
});
