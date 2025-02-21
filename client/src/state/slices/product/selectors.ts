import { RootState } from "../../store"; // Adjust the path based on your store location

export const selectProducts = (state: RootState) => state.product.products;
export const selectSelectedProduct = (state: RootState) =>
  state.product.selectedProduct;
export const selectIsLoading = (state: RootState) => state.product.isLoading;
export const selectError = (state: RootState) => state.product.error;
