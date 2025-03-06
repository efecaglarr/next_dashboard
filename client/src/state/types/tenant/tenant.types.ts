export interface Tenant {
  tenantId: string;
  userId: string;
  name: string;
  subDomain: string;
  phoneNumber: string;
  plan: string;
}

export interface TenantRegistrationData {
  name: string;
  subDomain: string;
  phoneNumber: string;
  plan: string;
}

export interface TenantState {
  tenant: Tenant | null;
  isLoading: boolean;
  error: string | null;
} 