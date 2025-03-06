import { baseApi } from "./baseApi";

interface User {
  userId: string;
  username: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  avatar?: string;
  phoneNumber?: string;
  googleId?: string;
}

interface DashboardStats {
  totalUsers: number;
  totalTenants: number;
  totalProducts: number;
  totalEmployees: number;
  recentUsers: {
    userId: string;
    username: string;
    email: string;
    createdAt: string;
  }[];
}

interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  role?: string;
  status?: string;
}

interface Tenant {
  tenantId: string;
  name: string;
  subDomain: string;
  plan: string;
  phoneNumber?: string;
  createdAt: string;
  updatedAt?: string;
  user: {
    userId: string;
    username: string;
    email: string;
  };
}

interface Product {
  productId: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  createdAt: string;
  updatedAt?: string;
  tenant: {
    tenantId: string;
    name: string;
  };
}

export const adminApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllUsers: build.query<{ users: User[] }, void>({
      query: () => "/admin/users",
      providesTags: ["Auth"],
    }),

    getDashboardStats: build.query<DashboardStats, void>({
      query: () => "/admin/dashboard",
      providesTags: ["Dashboard"],
    }),

    updateUserRole: build.mutation<{ user: User; message: string }, { userId: string; role: string }>({
      query: ({ userId, role }) => ({
        url: `/admin/users/${userId}/role`,
        method: "PUT",
        body: { role },
      }),
      invalidatesTags: ["Auth"],
    }),

    updateUserStatus: build.mutation<{ user: User; message: string }, { userId: string; status: string }>({
      query: ({ userId, status }) => ({
        url: `/admin/users/${userId}/status`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: ["Auth"],
    }),

    createUser: build.mutation<{ user: User; message: string }, CreateUserRequest>({
      query: (userData) => ({
        url: "/admin/users",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["Auth"],
    }),

    getAllTenants: build.query<{ tenants: Tenant[] }, void>({
      query: () => "/admin/tenants",
      providesTags: ["Tenant"],
    }),

    updateTenantPlan: build.mutation<{ tenant: Tenant; message: string }, { tenantId: string; plan: string }>({
      query: ({ tenantId, plan }) => ({
        url: `/admin/tenants/${tenantId}/plan`,
        method: "PUT",
        body: { plan },
      }),
      invalidatesTags: ["Tenant"],
    }),

    getAllProducts: build.query<{ products: Product[] }, void>({
      query: () => "/admin/products",
      providesTags: ["Products"],
    }),

    getProductsByTenant: build.query<{ products: Product[] }, string>({
      query: (tenantId) => `/admin/tenants/${tenantId}/products`,
      providesTags: ["Products"],
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useGetDashboardStatsQuery,
  useUpdateUserRoleMutation,
  useUpdateUserStatusMutation,
  useCreateUserMutation,
  useGetAllTenantsQuery,
  useUpdateTenantPlanMutation,
  useGetAllProductsQuery,
  useGetProductsByTenantQuery,
} = adminApi; 