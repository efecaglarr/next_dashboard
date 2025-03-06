"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAppSelector } from "@/state/store";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Redirect if user is not authenticated or not an admin
    if (!user || user.role !== "ADMIN") {
      router.push("/dashboard");
    }
  }, [user, router]);

  if (!user || user.role !== "ADMIN") {
    return null; // Don't render anything while redirecting
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        </div>
        <nav className="mt-6">
          <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Management
          </div>
          <Link href="/admin/users" className="block px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900">
            Users
          </Link>
          <Link href="/admin/tenants" className="block px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900">
            Tenants
          </Link>
          <Link href="/admin/products" className="block px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900">
            Products
          </Link>
          <Link href="/admin/employees" className="block px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900">
            Employees
          </Link>
          
          <div className="px-4 py-2 mt-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            System
          </div>
          <Link href="/admin/settings" className="block px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900">
            Settings
          </Link>
          <Link href="/admin/logs" className="block px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900">
            Logs
          </Link>
        </nav>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
} 