"use client";

import { useCreateProductMutation, useGetProductsQuery } from "@/state/api/productApi";
import { useGetAllTenantsQuery } from "@/state/api/adminApi";
import { PlusCircleIcon, SearchIcon, Package } from "lucide-react";
import { useState, useEffect } from "react";
import Header from "@/app/(components)/Header";
import Rating from "@/app/dashboard/(components)/Rating";
import CreateProductModal from "./CreateProductModal";
import Image from "next/image";
import { useAppSelector } from "@/state/store";
import { useGetTenantDetailsQuery } from "@/state/api/tenantApi";

type ProductFormData = {
  name: string;
  price: number;
  stockQuantity: number;
  rating: number;
  tenantId?: string;
};

const Products = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTenantId, setSelectedTenantId] = useState<string | null>(null);
  const { user } = useAppSelector((state) => state.auth);
  
  // Fetch data based on user role
  const isAdmin = user?.role === "ADMIN";
  const isTenant = user?.role === "TENANT";
  
  // For admin: fetch all tenants
  const { data: tenantsData } = useGetAllTenantsQuery(undefined, {
    skip: !isAdmin,
  });
  
  // For tenant: fetch tenant details
  const { data: tenantDetails, isLoading: isLoadingTenant, error: tenantError } = useGetTenantDetailsQuery(undefined, {
    skip: !isTenant,
  });
  
  // Debug tenant details
  useEffect(() => {
    if (isTenant) {
      console.log("Tenant user detected:", user);
      console.log("Tenant details:", tenantDetails);
      if (tenantError) {
        console.error("Error fetching tenant details:", tenantError);
      }
    }
  }, [isTenant, tenantDetails, tenantError, user]);
  
  // Set query parameters based on role and filters
  const queryParams = isAdmin && selectedTenantId 
    ? { tenantId: selectedTenantId } 
    : isTenant && tenantDetails?.tenant
    ? { tenantId: tenantDetails.tenant.tenantId }
    : {};
  
  // Debug query params
  useEffect(() => {
    console.log("Product query params:", queryParams);
  }, [queryParams]);
  
  // Fetch products based on role and filters
  const {
    data: products,
    isLoading: isLoadingProducts,
    isError: isProductsError,
    error: productsError
  } = useGetProductsQuery(queryParams);

  // Debug products
  useEffect(() => {
    console.log("Products data:", products);
    if (productsError) {
      console.error("Error fetching products:", productsError);
    }
  }, [products, productsError]);

  const [createProduct] = useCreateProductMutation();
  
  const handleCreateProduct = async (productData: ProductFormData) => {
    // Add tenantId to product data if tenant is selected or user is a tenant
    if (isAdmin && selectedTenantId) {
      productData.tenantId = selectedTenantId;
    } else if (isTenant && tenantDetails?.tenant) {
      productData.tenantId = tenantDetails.tenant.tenantId;
    }
    
    await createProduct(productData);
  };

  // Filter products by search term
  const filteredProducts = products?.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Update loading state to include tenant loading
  const isLoading = isLoadingProducts || (isTenant && isLoadingTenant);

  // Update error display to show more details
  if (isProductsError || !products) {
    return (
      <div className="text-center py-4">
        <div className="text-red-500 mb-4">Failed to fetch products</div>
        {productsError && (
          <div className="text-sm text-gray-600 max-w-md mx-auto">
            <p>Error details: {JSON.stringify(productsError)}</p>
            {isTenant && !tenantDetails?.tenant && (
              <p className="mt-2 text-yellow-600">
                Tenant information is missing. Please make sure your account is properly set up as a business owner.
              </p>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto pb-5 w-full">
      {/* SEARCH AND FILTER BAR */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex items-center border-2 border-gray-200 rounded flex-1">
          <SearchIcon className="w-5 h-5 text-gray-500 m-2" />
          <input
            className="w-full py-2 px-4 rounded bg-white dark:bg-gray-800 dark:text-white"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {/* Tenant filter for admin */}
        {isAdmin && tenantsData?.tenants && (
          <div className="flex items-center">
            <select
              className="py-2 px-4 border-2 border-gray-200 rounded bg-white dark:bg-gray-800 dark:text-white"
              value={selectedTenantId || ""}
              onChange={(e) => setSelectedTenantId(e.target.value || null)}
            >
              <option value="">All Businesses</option>
              {tenantsData.tenants.map((tenant) => (
                <option key={tenant.tenantId} value={tenant.tenantId}>
                  {tenant.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* HEADER BAR */}
      <div className="flex justify-between items-center mb-6">
        <Header name={isAdmin ? "All Products" : "My Products"} />
        <button
          className="flex items-center bg-blue-500 hover:bg-blue-700 text-gray-200 font-bold py-2 px-4 rounded"
          onClick={() => setIsModalOpen(true)}
        >
          <PlusCircleIcon className="w-5 h-5 mr-2 !text-gray-200" /> Create
          Product
        </button>
      </div>

      {/* EMPTY STATE */}
      {filteredProducts?.length === 0 && (
        <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <div className="flex flex-col items-center">
            <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full mb-4">
              <Package className="w-8 h-8 text-blue-500 dark:text-blue-300" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">No products found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
              {searchTerm 
                ? "No products match your search criteria. Try a different search term."
                : "You haven't added any products yet. Click the 'Create Product' button to get started."}
            </p>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded flex items-center"
              onClick={() => setIsModalOpen(true)}
            >
              <PlusCircleIcon className="w-5 h-5 mr-2" /> Create Product
            </button>
          </div>
        </div>
      )}

      {/* BODY PRODUCTS LIST */}
      {filteredProducts && filteredProducts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 justify-between">
          {filteredProducts.map((product) => (
            <div
              key={product.productId}
              className="border shadow rounded-md p-4 max-w-full w-full mx-auto bg-white dark:bg-gray-800 dark:border-gray-700"
            >
              <div className="flex flex-col items-center">
                <Image
                  src={`https://s3-inventorymanagement.s3.us-east-2.amazonaws.com/product${
                    Math.floor(Math.random() * 3) + 1
                  }.png`}
                  alt={product.name}
                  width={150}
                  height={150}
                  className="mb-3 rounded-2xl w-36 h-36"
                />
                <h3 className="text-lg text-gray-900 dark:text-white font-semibold">
                  {product.name}
                </h3>
                <p className="text-gray-800 dark:text-gray-200">${product.price.toFixed(2)}</p>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Stock: {product.stockQuantity}
                </div>
                {product.rating && (
                  <div className="flex items-center mt-2">
                    <Rating rating={product.rating} />
                  </div>
                )}
                <div className="mt-4 flex space-x-2">
                  <button className="bg-blue-500 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm">
                    Edit
                  </button>
                  <button className="bg-red-500 hover:bg-red-700 text-white px-3 py-1 rounded text-sm">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      <CreateProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateProduct}
        tenants={isAdmin ? tenantsData?.tenants : undefined}
        selectedTenantId={selectedTenantId}
        onTenantChange={isAdmin ? setSelectedTenantId : undefined}
      />
    </div>
  );
};

export default Products;