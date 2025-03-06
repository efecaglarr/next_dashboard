import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState } from "../../types";

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
  error: null,
  isTenantRegistration: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setStateCredentials: (state, action: PayloadAction<{ user: AuthState['user']; token: string; isTenant?: boolean }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isTenantRegistration = action.payload.isTenant || false;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isTenantRegistration = false;
    },
    setTenantRegistration: (state, action: PayloadAction<boolean>) => {
      state.isTenantRegistration = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const { 
  setStateCredentials, 
  logout, 
  setTenantRegistration,
  setLoading,
  setError
} = authSlice.actions;
export default authSlice.reducer;
