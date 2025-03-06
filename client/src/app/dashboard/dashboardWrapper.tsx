"use client";

import React, { useEffect } from "react";
import Navbar from "@/app/dashboard/(components)/Navbar";
import Sidebar from "@/app/dashboard/(components)/Sidebar";
import StoreProvider, { useAppSelector } from "../../state/store";
import { selectIsAuthenticated, selectToken } from "@/state/slices/auth/selectors";
import { useRouter } from "next/navigation";
import MuiThemeProvider from "./theme-provider";

// Separate the layout component that uses Redux hooks
const DashboardContent = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const token = useAppSelector(selectToken);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    }
  }, [isDarkMode]);

  useEffect(() => {
    // Check authentication for dashboard pages
    if (!isAuthenticated && !token) {
      router.push("/login");
    }
  }, [isAuthenticated, token, router]);

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
