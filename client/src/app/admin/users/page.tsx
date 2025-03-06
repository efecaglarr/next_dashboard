"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppSelector } from "@/state/store";
import { useGetAllUsersQuery, useUpdateUserRoleMutation, useUpdateUserStatusMutation } from "@/state/api/adminApi";
import { LoadingSpinner } from "@/app/(components)/Common/LoadingSpinner";
import { ErrorMessage } from "@/app/(components)/Common/ErrorMessage";
import { motion } from "framer-motion";
import Image from "next/image";

interface User {
  userId: string;
  username: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
  updatedAt?: string;
  avatar?: string;
  phoneNumber?: string;
  googleId?: string;
}

const AdminUsersPage = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserDetails, setShowUserDetails] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get('id');
  const { user } = useAppSelector((state) => state.auth);
  
  const { data, isLoading, error, refetch } = useGetAllUsersQuery();
  const [updateUserRole, { isLoading: isUpdatingRole }] = useUpdateUserRoleMutation();
  const [updateUserStatus, { isLoading: isUpdatingStatus }] = useUpdateUserStatusMutation();

  useEffect(() => {
    // Redirect if user is not authenticated or not an admin
    if (!user || user.role !== "ADMIN") {
      router.push("/dashboard");
      return;
    }
  }, [user, router]);

  useEffect(() => {
    // If there's a userId in the URL, show that user's details
    if (userId && data?.users) {
      const userToShow = data.users.find(u => u.userId === userId);
      if (userToShow) {
        setSelectedUser(userToShow);
        setShowUserDetails(true);
      }
    }
  }, [userId, data]);

  const handleViewDetails = (user: User) => {
    setSelectedUser(user);
    setShowUserDetails(true);
    // Update URL without reloading the page
    router.push(`/admin/users?id=${user.userId}`, { scroll: false });
  };

  const handleCloseDetails = () => {
    setShowUserDetails(false);
    setSelectedUser(null);
    // Remove the id from the URL
    router.push('/admin/users', { scroll: false });
  };

  const handleChangeRole = async (userId: string, newRole: string) => {
    try {
      await updateUserRole({ userId, role: newRole }).unwrap();
      refetch();
      
      // Update the selected user if it's the one being modified
      if (selectedUser && selectedUser.userId === userId) {
        setSelectedUser({ ...selectedUser, role: newRole });
      }
    } catch (err) {
      console.error('Failed to update user role:', err);
    }
  };

  const handleChangeStatus = async (userId: string, newStatus: string) => {
    try {
      await updateUserStatus({ userId, status: newStatus }).unwrap();
      refetch();
      
      // Update the selected user if it's the one being modified
      if (selectedUser && selectedUser.userId === userId) {
        setSelectedUser({ ...selectedUser, status: newStatus });
      }
    } catch (err) {
      console.error('Failed to update user status:', err);
    }
  };

  if (isLoading || isUpdatingRole || isUpdatingStatus) return <LoadingSpinner />;
  if (error) return <ErrorMessage message="Failed to load users. Please try again." />;
  if (!data?.users) return <ErrorMessage message="No users found" />;

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">User Management</h1>
        <p className="text-gray-600">Manage all users in the system</p>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">All Users</h2>
          <button
            onClick={() => router.push('/admin/users/create')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
          >
            Add New User
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.users.map((user) => (
                <tr key={user.userId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-700 font-medium">
                        {user.avatar ? (
                          <Image 
                            src={user.avatar} 
                            alt={`${user.username}'s avatar`} 
                            width={40}
                            height={40}
                            className="h-10 w-10 rounded-full"
                          />
                        ) : (
                          <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                            {user.username?.charAt(0).toUpperCase() || 'U'}
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.username}</div>
                        <div className="text-sm text-gray-500">Created {new Date(user.createdAt).toLocaleDateString()}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 
                        user.role === 'TENANT' ? 'bg-green-100 text-green-800' : 
                        'bg-blue-100 text-blue-800'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${user.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 
                        user.status === 'INACTIVE' ? 'bg-gray-100 text-gray-800' : 
                        'bg-red-100 text-red-800'}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={() => handleViewDetails(user)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      View
                    </button>
                    <button 
                      onClick={() => handleChangeStatus(
                        user.userId, 
                        user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
                      )}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      {user.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Details Modal */}
      {showUserDetails && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-800">User Details</h3>
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
                <div className="h-16 w-16 bg-gray-200 rounded-full flex items-center justify-center text-gray-700 text-xl font-medium">
                  {selectedUser.avatar ? (
                    <Image 
                      src={selectedUser.avatar} 
                      alt={`${selectedUser.username}'s avatar`} 
                      width={64}
                      height={64}
                      className="h-16 w-16 rounded-full"
                    />
                  ) : (
                    <div className="h-16 w-16 bg-gray-200 rounded-full flex items-center justify-center text-xl font-medium">
                      {selectedUser.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  )}
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-semibold text-gray-900">{selectedUser.username}</h4>
                  <p className="text-gray-600">{selectedUser.email}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500">User ID</p>
                  <p className="text-gray-900">{selectedUser.userId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone Number</p>
                  <p className="text-gray-900">{selectedUser.phoneNumber || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Created At</p>
                  <p className="text-gray-900">{new Date(selectedUser.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Last Updated</p>
                  <p className="text-gray-900">{selectedUser.updatedAt ? new Date(selectedUser.updatedAt).toLocaleString() : 'Never'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Google Account</p>
                  <p className="text-gray-900">{selectedUser.googleId ? 'Linked' : 'Not linked'}</p>
                </div>
              </div>
              
              <div className="mb-6">
                <p className="text-sm text-gray-500 mb-2">Role</p>
                <div className="flex space-x-2">
                  {['USER', 'TENANT', 'EMPLOYEE', 'ADMIN'].map((role) => (
                    <button
                      key={role}
                      onClick={() => handleChangeRole(selectedUser.userId, role)}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        selectedUser.role === role 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="mb-6">
                <p className="text-sm text-gray-500 mb-2">Status</p>
                <div className="flex space-x-2">
                  {['ACTIVE', 'INACTIVE', 'SUSPENDED'].map((status) => (
                    <button
                      key={status}
                      onClick={() => handleChangeStatus(selectedUser.userId, status)}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        selectedUser.status === status 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
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

export default AdminUsersPage; 