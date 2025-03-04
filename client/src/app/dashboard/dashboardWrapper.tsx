"use client";

import React, { useEffect } from "react";
import Navbar from "@/app/dashboard/(components)/Navbar";
import Sidebar from "@/app/dashboard/(components)/Sidebar";
import StoreProvider, { useAppSelector } from "../../state/store";
import { selectIsAuthenticated, selectToken } from "@/state/slices/auth/selectors";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import MuiThemeProvider from "./theme-provider";

// Separate the layout component that uses Redux hooks
const DashboardContent = ({ children }: { children: React.ReactNode }) => {

  const pathname = usePathname();
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const token = useAppSelector(selectToken);

  const isAuthPage = pathname?.includes('/login') || pathname?.includes('/register');

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    }
  }, [isDarkMode]);

  // Show auth pages with back button
  if (isAuthPage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="absolute top-4 left-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Homepage
          </Link>
        </div>
        {children}
      </div>
    );
  }

  // Check authentication for other dashboard pages
  if (!isAuthenticated && !token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please log in to continue</h2>
          <div className="space-x-4">
            <Link
              href="/login"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Login
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Show authenticated layout
  return (
    <div
      className={`${
        isDarkMode ? "dark" : "light"
      } flex bg-gray-50 text-gray-900 w-full min-h-screen`}
    >
      <Sidebar />
      <main
        className={`flex flex-col w-full h-full py-7 px-9 bg-gray-50 ${
          isSidebarCollapsed ? "md:pl-24" : "md:pl-72"
        }`}
      >
        <Navbar />
        {children}
      </main>
    </div>
  );
};

// Wrapper component that provides the Redux store
const DashboardWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <StoreProvider>
      <MuiThemeProvider>
        <DashboardContent>{children}</DashboardContent>
      </MuiThemeProvider>
    </StoreProvider>
  );
};

export default DashboardWrapper;
