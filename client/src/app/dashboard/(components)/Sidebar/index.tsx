"use client";
import { useAppDispatch, useAppSelector } from "@/state/store";
import { setIsSidebarCollapsed } from "@/state/slices/global/globalSlice";
import {
  Archive,
  CircleDollarSign,
  Clipboard,
  Layout,
  LucideIcon,
  Menu,
  Users,
  Building,
  ShoppingBag,
  BarChart,
  Settings,
  Home
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface SideBarLinkProps {
  href: string;
  icon: LucideIcon;
  label: string;
  isCollapsed: boolean;
}

const SideBarLink = ({
  href,
  icon: Icon,
  label,
  isCollapsed,
}: SideBarLinkProps) => {
  const pathName = usePathname();
  const isActive =
    pathName === href || (pathName === "/" && href === "/dashboard");

  return (
    <Link href={href}>
      <div
        className={`cursor-pointer flex items-center ${
          isCollapsed ? "justify-center py-4" : "justify-start px-8 py-4"
        } hover:text-blue-500 hover:bg-blue-100 gap-3 transition-colors ${
          isActive ? "bg-blue-200 text-white " : ""
        }`}
      >
        <Icon className="w-6 h-6 !text-gray-700" />
        <span
          className={`${
            isCollapsed ? "hidden" : "block"
          } font-medium text-gray-700`}
        >
          {label}
        </span>
      </div>
    </Link>
  );
};

const Sidebar = () => {
  const dispatch = useAppDispatch();
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const user = useAppSelector((state) => state.auth.user);

  const toggleSidebar = () => {
    dispatch(setIsSidebarCollapsed(!isSidebarCollapsed));
  };

  const sideBarClassNames = `fixed flex flex-col ${
    isSidebarCollapsed ? "w-0 md:w-16" : "w-72 md:w-64"
  } bg-white transition-all duration-300 overflow-hidden h-full shadow-md z-40`;

  // Define navigation links based on user role
  const getNavigationLinks = () => {
    // Common links for all users
    const commonLinks = [
      {
        href: "/dashboard",
        icon: Home,
        label: "Dashboard",
      },
      {
        href: "/dashboard/settings",
        icon: Settings,
        label: "Settings",
      },
    ];

    // Admin-specific links
    if (user?.role === "ADMIN") {
      return [
        ...commonLinks,
        {
          href: "/dashboard/users",
          icon: Users,
          label: "Users",
        },
        {
          href: "/dashboard/tenants",
          icon: Building,
          label: "Tenants",
        },
        {
          href: "/dashboard/products",
          icon: ShoppingBag,
          label: "Products",
        },
        {
          href: "/dashboard/analytics",
          icon: BarChart,
          label: "Analytics",
        },
      ];
    }

    // Tenant-specific links
    if (user?.role === "TENANT") {
      return [
        ...commonLinks,
        {
          href: "/dashboard/inventory",
          icon: Archive,
          label: "Inventory",
        },
        {
          href: "/dashboard/products",
          icon: Clipboard,
          label: "Products",
        },
        {
          href: "/dashboard/orders",
          icon: ShoppingBag,
          label: "Orders",
        },
        {
          href: "/dashboard/expenses",
          icon: CircleDollarSign,
          label: "Expenses",
        },
      ];
    }

    // Regular user links
    return [
      ...commonLinks,
      {
        href: "/dashboard/demo",
        icon: Layout,
        label: "Demo",
      },
    ];
  };

  const navigationLinks = getNavigationLinks();

  return (
    <div className={sideBarClassNames}>
      {/* TOP LOGO */}
      <div
        className={`flex gap-3 justify-between md:justify-normal items-center pt-8 ${
          isSidebarCollapsed ? "px-5" : "px-8"
        }`}
      >
        <Image
          className={`font-extrabold text-2xl ${
            isSidebarCollapsed ? "hidden" : "block"
          }`}
          src={isDarkMode ? "/images/fbm-w.png" : "/images/fbm-b.png"}
          alt="logo"
          width={50}
          height={50}
        />

        <button
          className="md:hidden px-3 py-3 bg-gray-100 rounded-full hover:bg-blue-100"
          onClick={toggleSidebar}
        >
          <Menu className="w-4 h-4" />
        </button>
      </div>

      {/* USER ROLE INDICATOR */}
      {!isSidebarCollapsed && user && (
        <div className="mt-6 px-8">
          <div className="bg-blue-50 text-blue-700 py-2 px-4 rounded-md text-sm font-medium">
            {user.role === "ADMIN" ? "Admin" : user.role === "TENANT" ? "Business Owner" : "User"}
          </div>
        </div>
      )}

      {/* LINKS */}
      <div className="flex-grow mt-8">
        {navigationLinks.map((link) => (
          <SideBarLink
            key={link.href}
            href={link.href}
            icon={link.icon}
            label={link.label}
            isCollapsed={isSidebarCollapsed}
          />
        ))}
      </div>

      {/* FOOTER */}
      <div className={`${isSidebarCollapsed ? "hidden" : "block"} mb-10`}>
        <p className="text-center text-xs text-gray-500">&copy;2025 Caglar</p>
      </div>
    </div>
  );
};

export default Sidebar;
