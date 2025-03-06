"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppSelector } from "@/state/store";
import { useGetAllTenantsQuery, useUpdateTenantPlanMutation } from "@/state/api/adminApi";
import { LoadingSpinner } from "@/app/(components)/Common/LoadingSpinner";
import { ErrorMessage } from "@/app/(components)/Common/ErrorMessage";
import { motion } from "framer-motion";
import Link from "next/link";

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

const AdminTenantsPage = () => {
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [showTenantDetails, setShowTenantDetails] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const tenantId = searchParams.get('id');
  const { user } = useAppSelector((state) => state.auth);
  
  const { data, isLoading, error, refetch } = useGetAllTenantsQuery();
  const [updateTenantPlan, { isLoading: isUpdatingPlan }] = useUpdateTenantPlanMutation();

  useEffect(() => {
    // Redirect if user is not authenticated or not an admin
    if (!user || user.role !== "ADMIN") {
      router.push("/dashboard");
      return;
    }
  }, [user, router]);

  useEffect(() => {
    // If there's a tenantId in the URL, show that tenant's details
    if (tenantId && data?.tenants) {
      const tenantToShow = data.tenants.find(t => t.tenantId === tenantId);
      if (tenantToShow) {
        setSelectedTenant(tenantToShow);
        setShowTenantDetails(true);
      }
    }
  }, [tenantId, data]);

  const handleViewDetails = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setShowTenantDetails(true);
    // Update URL without reloading the page
    router.push(`/admin/tenants?id=${tenant.tenantId}`, { scroll: false });
  };

  const handleCloseDetails = () => {
    setShowTenantDetails(false);
    setSelectedTenant(null);
    // Remove the id from the URL
    router.push('/admin/tenants', { scroll: false });
  };

  const handleChangePlan = async (tenantId: string, newPlan: string) => {
    try {
      await updateTenantPlan({ tenantId, plan: newPlan }).unwrap();
      refetch();
      
      // Update the selected tenant if it's the one being modified
      if (selectedTenant && selectedTenant.tenantId === tenantId) {
        setSelectedTenant({ ...selectedTenant, plan: newPlan });
      }
    } catch (err) {
      console.error('Failed to update tenant plan:', err);
    }
  };

  if (isLoading || isUpdatingPlan) return <LoadingSpinner />;
  if (error) return <ErrorMessage message="Failed to load tenants. Please try again." />;
  if (!data?.tenants) return <ErrorMessage message="No tenants found" />;

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Tenant Management</h1>
        <p className="text-gray-600">Manage all business accounts in the system</p>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">All Tenants</h2>
          <button
            onClick={() => router.push('/admin/tenants/create')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
          >
            Add New Tenant
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tenant</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.tenants.map((tenant) => (
                <tr key={tenant.tenantId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-medium">
                        {tenant.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{tenant.name}</div>
                        <div className="text-sm text-gray-500">{tenant.subDomain}.example.com</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{tenant.user.username}</div>
                    <div className="text-sm text-gray-500">{tenant.user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${tenant.plan === 'PREMIUM' ? 'bg-purple-100 text-purple-800' : 
                        tenant.plan === 'STANDARD' ? 'bg-blue-100 text-blue-800' : 
                        'bg-gray-100 text-gray-800'}`}>
                      {tenant.plan}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {new Date(tenant.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={() => handleViewDetails(tenant)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      View
                    </button>
                    <Link 
                      href={`/admin/tenants/${tenant.tenantId}/products`}
                      className="text-green-600 hover:text-green-900 mr-3"
                    >
                      Products
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tenant Details Modal */}
      {showTenantDetails && selectedTenant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-800">Tenant Details</h3>
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
                <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center text-green-700 text-xl font-medium">
                  {selectedTenant.name.charAt(0).toUpperCase()}
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-semibold text-gray-900">{selectedTenant.name}</h4>
                  <p className="text-gray-600">{selectedTenant.subDomain}.example.com</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500">Tenant ID</p>
                  <p className="text-gray-900">{selectedTenant.tenantId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone Number</p>
                  <p className="text-gray-900">{selectedTenant.phoneNumber || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Created At</p>
                  <p className="text-gray-900">{new Date(selectedTenant.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Last Updated</p>
                  <p className="text-gray-900">{selectedTenant.updatedAt ? new Date(selectedTenant.updatedAt).toLocaleString() : 'Never'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Owner</p>
                  <p className="text-gray-900">{selectedTenant.user.username} ({selectedTenant.user.email})</p>
                </div>
              </div>
              
              <div className="mb-6">
                <p className="text-sm text-gray-500 mb-2">Subscription Plan</p>
                <div className="flex space-x-2">
                  {['FREE', 'STANDARD', 'PREMIUM'].map((plan) => (
                    <button
                      key={plan}
                      onClick={() => handleChangePlan(selectedTenant.tenantId, plan)}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        selectedTenant.plan === plan 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                      }`}
                    >
                      {plan}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="mb-6">
                <p className="text-sm text-gray-500 mb-2">Quick Actions</p>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href={`/admin/tenants/${selectedTenant.tenantId}/products`}
                    className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium hover:bg-green-200"
                  >
                    View Products
                  </Link>
                  <Link
                    href={`/admin/tenants/${selectedTenant.tenantId}/employees`}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium hover:bg-blue-200"
                  >
                    View Employees
                  </Link>
                  <Link
                    href={`/admin/users?id=${selectedTenant.user.userId}`}
                    className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium hover:bg-purple-200"
                  >
                    View Owner Account
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

export default AdminTenantsPage; 