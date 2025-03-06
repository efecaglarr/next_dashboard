"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/state/store";
import { LoadingSpinner } from "@/app/(components)/Common/LoadingSpinner";
import {
  CheckCircle,
  Package,
  Tag,
  TrendingDown,
  TrendingUp,
  Users,
  Building,
  ShoppingBag,
  BarChart,
} from "lucide-react";
import CardExpenseSummary from "./(ui)/CardExpenseSummary";
import CardPopularProducts from "./(ui)/CardPopularProducts";
import CardPurchaseSummary from "./(ui)/CardPurchaseSummary";
import CardSalesSummary from "./(ui)/CardSalesSummary";
import StatCard from "./(ui)/StatCard";
import { useGetDashboardStatsQuery } from "@/state/api/adminApi";

// Define types for the dashboard stats
interface DashboardStats {
  totalUsers: number;
  totalTenants: number;
  totalProducts: number;
  totalRevenue: number;
  recentActivities: Array<{
    user?: { username: string };
    description: string;
    timestamp: string;
  }>;
}

// Admin Dashboard Component
const AdminDashboard = ({ stats }: { stats?: DashboardStats }) => {
  return (
    <div className="p-6">
      {/* Admin Stats Section */}
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Admin Overview</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                <Users className="h-8 w-8" />
              </div>
              <div className="ml-4">
                <p className="text-gray-500 dark:text-gray-400 text-sm">Total Users</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">{stats?.totalUsers || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                <Building className="h-8 w-8" />
              </div>
              <div className="ml-4">
                <p className="text-gray-500 dark:text-gray-400 text-sm">Total Tenants</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">{stats?.totalTenants || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200">
                <ShoppingBag className="h-8 w-8" />
              </div>
              <div className="ml-4">
                <p className="text-gray-500 dark:text-gray-400 text-sm">Total Products</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">{stats?.totalProducts || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200">
                <BarChart className="h-8 w-8" />
              </div>
              <div className="ml-4">
                <p className="text-gray-500 dark:text-gray-400 text-sm">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">${stats?.totalRevenue?.toFixed(2) || '0.00'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Recent Activity</h2>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="space-y-4">
            {stats?.recentActivities && stats.recentActivities.length > 0 ? (
              stats.recentActivities.map((activity: { user?: { username: string }; description: string; timestamp: string }, index: number) => (
                <div key={index} className="flex items-start pb-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                      <span className="text-blue-600 dark:text-blue-300 font-bold">{activity.user?.username?.charAt(0) || 'U'}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-800 dark:text-gray-200">{activity.description}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(activity.timestamp).toLocaleString()}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No recent activities</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Tenant Dashboard Component
const TenantDashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Business Dashboard</h1>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Sales & Growth"
          primaryIcon={<Tag className="text-blue-600 w-6 h-6" />}
          dateRange="Last 30 days"
          details={[
            {
              title: "Total Sales",
              amount: "$12,345",
              changePercentage: 8.5,
              IconComponent: TrendingUp,
            },
            {
              title: "Growth",
              amount: "24%",
              changePercentage: 8.5,
              IconComponent: TrendingUp,
            },
          ]}
        />
        <StatCard
          title="Orders & Returns"
          primaryIcon={<Package className="text-purple-600 w-6 h-6" />}
          dateRange="Last 30 days"
          details={[
            {
              title: "Total Orders",
              amount: "142",
              changePercentage: -2.3,
              IconComponent: TrendingDown,
            },
            {
              title: "Returns",
              amount: "12",
              changePercentage: -5.7,
              IconComponent: TrendingDown,
            },
          ]}
        />
        <StatCard
          title="Inventory Status"
          primaryIcon={<CheckCircle className="text-green-600 w-6 h-6" />}
          dateRange="Last 30 days"
          details={[
            {
              title: "Total Items",
              amount: "1,234",
              changePercentage: 3.7,
              IconComponent: TrendingUp,
            },
            {
              title: "Low Stock",
              amount: "28",
              changePercentage: -12.4,
              IconComponent: TrendingDown,
            },
          ]}
        />
        <StatCard
          title="Expenses & Revenue"
          primaryIcon={<Tag className="text-yellow-600 w-6 h-6" />}
          dateRange="Last 30 days"
          details={[
            {
              title: "Expenses",
              amount: "$4,567",
              changePercentage: 1.2,
              IconComponent: TrendingUp,
            },
            {
              title: "Revenue",
              amount: "$9,876",
              changePercentage: 4.8,
              IconComponent: TrendingUp,
            },
          ]}
        />
      </div>

      {/* Charts and Summaries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <CardSalesSummary />
        <CardExpenseSummary />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CardPopularProducts />
        <CardPurchaseSummary />
      </div>
    </div>
  );
};

// User Dashboard Component
const UserDashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Welcome to the Dashboard</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Getting Started</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Welcome to our platform! This is a demo dashboard for regular users. To access more features, 
          please consider upgrading to a business account.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Explore Demo Features
          </button>
          <button className="border border-blue-600 text-blue-600 px-6 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors">
            Upgrade to Business
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Feature Highlights</h3>
          <ul className="space-y-2 text-gray-600 dark:text-gray-300">
            <li className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>Inventory Management</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>Order Processing</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>Analytics Dashboard</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>Customer Management</span>
            </li>
          </ul>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Recent Updates</h3>
          <div className="space-y-4">
            <div className="pb-3 border-b border-gray-200 dark:border-gray-700">
              <p className="text-gray-800 dark:text-gray-200 font-medium">New Inventory Features</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Added bulk import and export capabilities</p>
            </div>
            <div className="pb-3 border-b border-gray-200 dark:border-gray-700">
              <p className="text-gray-800 dark:text-gray-200 font-medium">Enhanced Reporting</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">New customizable reports and charts</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Help & Resources</h3>
          <div className="space-y-3">
            <a href="#" className="block text-blue-600 hover:underline">Documentation</a>
            <a href="#" className="block text-blue-600 hover:underline">Video Tutorials</a>
            <a href="#" className="block text-blue-600 hover:underline">Contact Support</a>
            <a href="#" className="block text-blue-600 hover:underline">FAQ</a>
          </div>
        </div>
      </div>
    </div>
  );
};

const DashboardPage = () => {
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);
  const { data: stats, isLoading: isLoadingStats } = useGetDashboardStatsQuery(undefined, {
    skip: !user || user.role !== "ADMIN"
  });

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
  }, [user, router]);

  // Show loading while checking auth or loading stats
  if (!user || (user.role === "ADMIN" && isLoadingStats)) {
    return <LoadingSpinner />;
  }

  // Render dashboard based on user role
  if (user.role === "ADMIN") {
    return <AdminDashboard stats={stats as unknown as DashboardStats} />;
  } else if (user.role === "TENANT") {
    return <TenantDashboard />;
  } else {
    return <UserDashboard />;
  }
};

export default DashboardPage;
