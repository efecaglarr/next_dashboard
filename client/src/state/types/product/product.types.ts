export interface Product {
  productId: string;
  name: string;
  price: number;
  rating?: number;
  stockQuantity: number;
  reviews: ProductReview[];
  tenantId?: string;
}

export interface ProductState {
  products: Product[];
  selectedProduct?: Product | null;
  isLoading: boolean;
  error?: string | null;
}

export interface ProductReview {
  productReviewId: string;
  userId: string;
  productId: string;
  star: number;
  description: string;
}

export interface NewProduct {
  name: string;
  price: number;
  stockQuantity: number;
  rating?: number;
  tenantId?: string;
}

export interface QueryParams {
  search?: string;
  tenantId?: string;
}
