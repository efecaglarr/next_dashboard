export interface Customer {
  userId: string;
  email: string;
  name: string;
  phoneNumber: string;
  confirmed: boolean;
}

export interface CustomerState {
  customers: Customer[];    // This is an array of customers
  selectedCustomer: Customer | null;
  isLoading: boolean;
  error: string | null;
}


