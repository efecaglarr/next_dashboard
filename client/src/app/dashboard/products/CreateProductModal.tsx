import React, { ChangeEvent, FormEvent, useState } from "react";
import Header from "@/app/(components)/Header";
import { useAppSelector } from "@/state/store";

type ProductFormData = {
  name: string;
  price: number;
  stockQuantity: number;
  rating: number;
  tenantId?: string;
};

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

type CreateProductModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (formData: ProductFormData) => void;
  tenants?: Tenant[];
  selectedTenantId?: string | null;
  onTenantChange?: (tenantId: string | null) => void;
};

const CreateProductModal = ({
  isOpen,
  onClose,
  onCreate,
  tenants,
  selectedTenantId,
  onTenantChange,
}: CreateProductModalProps) => {
  const { user } = useAppSelector((state) => state.auth);
  const isAdmin = user?.role === "ADMIN";

  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    stockQuantity: 0,
    rating: 0,
    tenantId: selectedTenantId || "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    if (name === "tenantId" && onTenantChange) {
      onTenantChange(value || null);
    }
    
    setFormData({
      ...formData,
      [name]:
        name === "price" || name === "stockQuantity" || name === "rating"
          ? parseFloat(value)
          : value,
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onCreate(formData);
    onClose();
    
    // Reset form
    setFormData({
      name: "",
      price: 0,
      stockQuantity: 0,
      rating: 0,
      tenantId: selectedTenantId || "",
    });
  };

  if (!isOpen) return null;

  const labelCssStyles = "block text-sm font-medium text-gray-700 dark:text-gray-300";
  const inputCssStyles =
    "block w-full mb-2 p-2 border-gray-500 border-2 rounded-md dark:bg-gray-800 dark:text-white";

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-20">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-900 dark:border-gray-700">
        <Header name="Create New Product" />
        <form onSubmit={handleSubmit} className="mt-5">
          {/* TENANT SELECTION (ADMIN ONLY) */}
          {isAdmin && tenants && (
            <>
              <label htmlFor="tenantId" className={labelCssStyles}>
                Business
              </label>
              <select
                name="tenantId"
                onChange={handleChange}
                value={formData.tenantId}
                className={inputCssStyles}
                required
              >
                <option value="">Select a business</option>
                {tenants.map((tenant) => (
                  <option key={tenant.tenantId} value={tenant.tenantId}>
                    {tenant.name}
                  </option>
                ))}
              </select>
            </>
          )}

          {/* PRODUCT NAME */}
          <label htmlFor="productName" className={labelCssStyles}>
            Product Name
          </label>
          <input
            type="text"
            name="name"
            placeholder="Name"
            onChange={handleChange}
            value={formData.name}
            className={inputCssStyles}
            required
          />

          {/* PRICE */}
          <label htmlFor="productPrice" className={labelCssStyles}>
            Price
          </label>
          <input
            type="number"
            name="price"
            placeholder="Price"
            onChange={handleChange}
            value={formData.price}
            className={inputCssStyles}
            required
          />

          {/* STOCK QUANTITY */}
          <label htmlFor="stockQuantity" className={labelCssStyles}>
            Stock Quantity
          </label>
          <input
            type="number"
            name="stockQuantity"
            placeholder="Stock Quantity"
            onChange={handleChange}
            value={formData.stockQuantity}
            className={inputCssStyles}
            required
          />

          {/* RATING */}
          <label htmlFor="rating" className={labelCssStyles}>
            Rating
          </label>
          <input
            type="number"
            name="rating"
            placeholder="Rating"
            onChange={handleChange}
            value={formData.rating}
            className={inputCssStyles}
            required
          />

          {/* CREATE ACTIONS */}
          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          >
            Create
          </button>
          <button
            onClick={onClose}
            type="button"
            className="ml-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateProductModal;