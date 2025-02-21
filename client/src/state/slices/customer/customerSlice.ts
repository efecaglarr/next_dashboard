import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CustomerState, Customer } from "../../types";

const initialState: CustomerState = {
  customers: [],
  selectedCustomer: null,
  isLoading: false,
  error: null,
};

export const customerSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setCustomers: (state, action: PayloadAction<Customer[]>) => {
      state.customers = action.payload;
    },
    setSelectedCustomer: (state, action: PayloadAction<Customer | null>) => {
      state.selectedCustomer = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setCustomers, setSelectedCustomer, setLoading, setError } =
  customerSlice.actions;
export default customerSlice.reducer;
