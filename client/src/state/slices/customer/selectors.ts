import { RootState } from "../../store"; // Adjust the path based on your store location

export const selectCustomers = (state: RootState) => state.customer.customers;
export const setSelectedCustomer = (state: RootState) =>
  state.customer.selectedCustomer;
export const selectIsLoading = (state: RootState) => state.customer.isLoading;
export const selectError = (state: RootState) => state.customer.error;
