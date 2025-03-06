"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppSelector } from "@/state/store";
import { useGetAllProductsQuery } from "@/state/api/adminApi";
import { LoadingSpinner } from "@/app/(components)/Common/LoadingSpinner";
import { ErrorMessage } from "@/app/(components)/Common/ErrorMessage";
import { motion } from "framer-motion";
import Link from "next/link";

interface Product {
  productId: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  createdAt: string;
  updatedAt?: string;
  tenant: {
    tenantId: string;
    name: string;
  };
}

const AdminProductsPage = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showProductDetails, setShowProductDetails] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get('id');
  const { user } = useAppSelector((state) => state.auth);
  
  const { data, isLoading, error } = useGetAllProductsQuery();

  useEffect(() => {
    // Redirect if user is not authenticated or not an admin
    if (!user || user.role !== "ADMIN") {
      router.push("/dashboard");
      return;
    }
  }, [user, router]);

  useEffect(() => {
    // If there's a productId in the URL, show that product's details
    if (productId && data?.products) {
      const productToShow = data.products.find(p => p.productId === productId);
      if (productToShow) {
        setSelectedProduct(productToShow);
        setShowProductDetails(true);
      }
    }
  }, [productId, data]);

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setShowProductDetails(true);
    // Update URL without reloading the page
    router.push(`/admin/products?id=${product.productId}`, { scroll: false });
  };

  const handleCloseDetails = () => {
    setShowProductDetails(false);
    setSelectedProduct(null);
    // Remove the id from the URL
    router.push('/admin/products', { scroll: false });
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message="Failed to load products. Please try again." />;
  if (!data?.products) return <ErrorMessage message="No products found" />;

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Product Management</h1>
        <p className="text-gray-600">Manage all products in the system</p>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">All Products</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tenant</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.products.map((product) => (
                <tr key={product.productId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-700 font-medium">
                        {product.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500">{product.category}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{product.tenant.name}</div>
                    <Link 
                      href={`/admin/tenants?id=${product.tenant.tenantId}`}
                      className="text-sm text-blue-600 hover:text-blue-900"
                    >
                      View Tenant
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">${product.price.toFixed(2)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${product.stock > 100 ? 'bg-green-100 text-green-800' : 
                        product.stock > 20 ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'}`}>
                      {product.stock} in stock
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={() => handleViewDetails(product)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Details Modal */}
      {showProductDetails && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-800">Product Details</h3>
              <button 
                onClick={handleCloseDetails}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex items-center mb-6">
                <div className="h-16 w-16 bg-purple-100 rounded-full flex items-center justify-center text-purple-700 text-xl font-medium">
                  {selectedProduct.name.charAt(0).toUpperCase()}
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-semibold text-gray-900">{selectedProduct.name}</h4>
                  <p className="text-gray-600">{selectedProduct.category}</p>
                </div>
              </div>
              
              <div className="mb-6">
                <p className="text-sm text-gray-500">Description</p>
                <p className="text-gray-900 mt-1">{selectedProduct.description}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500">Product ID</p>
                  <p className="text-gray-900">{selectedProduct.productId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Price</p>
                  <p className="text-gray-900">${selectedProduct.price.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Stock</p>
                  <p className="text-gray-900">{selectedProduct.stock} units</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Created At</p>
                  <p className="text-gray-900">{new Date(selectedProduct.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Last Updated</p>
                  <p className="text-gray-900">{selectedProduct.updatedAt ? new Date(selectedProduct.updatedAt).toLocaleString() : 'Never'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tenant</p>
                  <Link 
                    href={`/admin/tenants?id=${selectedProduct.tenant.tenantId}`}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    {selectedProduct.tenant.name}
                  </Link>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 border-t border-gray-200 pt-4">
                <button
                  onClick={handleCloseDetails}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminProductsPage; 