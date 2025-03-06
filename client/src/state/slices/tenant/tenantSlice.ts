import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Tenant, TenantState } from "../../types/tenant/tenant.types";

const initialState: TenantState = {
  tenant: null,
  isLoading: false,
  error: null,
};

export const tenantSlice = createSlice({
  name: "tenant",
  initialState,
  reducers: {
    setTenant: (state, action: PayloadAction<Tenant>) => {
      state.tenant = action.payload;
      state.error = null;
    },
    clearTenant: (state) => {
      state.tenant = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const { setTenant, clearTenant, setLoading, setError } = tenantSlice.actions;

export default tenantSlice.reducer; 