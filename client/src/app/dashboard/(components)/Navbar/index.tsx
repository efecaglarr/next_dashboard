"use client";
import { useAppDispatch, useAppSelector } from "@/state/store";
import {
  setIsDarkMode,
  setIsSidebarCollapsed,
} from "@/state/slices/global/globalSlice";
import {
  // Bell,
  MenuIcon,
  Moon,
  // Settings,
  Sun,
  LogOut,
} from "lucide-react";
// import Link from "next/link";
import { selectUser } from "@/state/slices/auth/selectors";
import { useLogoutMutation } from "@/state/api/authApi";
import { useRouter } from "next/navigation";
import { logout } from "@/state/slices/auth/authSlice";

const Navbar = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const user = useAppSelector(selectUser);
  const [logoutMutation] = useLogoutMutation();

  const toggleSidebar = () => {
    dispatch(setIsSidebarCollapsed(!isSidebarCollapsed));
  };

  const toggleDarkMode = () => {
    dispatch(setIsDarkMode(!isDarkMode));
  };

  const handleLogout = async () => {
    try {
      await logoutMutation().unwrap();
      dispatch(logout());
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="flex justify-between items-center w-full mb-7">
      {/* LEFT SIDE */}
      <div className="flex items-center gap-5">
        <button
          className="px-3 py-3 bg-gray-100 rounded-full hover:bg-blue-100"
          onClick={toggleSidebar}
        >
          <MenuIcon className="w-4 h-4" />
        </button>
        <div className="relative">
          <input
            type="search"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 w-50 md:w-60 border-2 border-gray-300 bg-white rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>
      {/* RIGHT SIDE */}

      <div className="flex items-center gap-5">
        <button onClick={toggleDarkMode}>
          {isDarkMode ? (
            <Sun className="cursor-pointer text-gray-500" size={24} />
          ) : (
            <Moon className="cursor-pointer text-gray-500" size={24} />
          )}
        </button>

        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-700">
            {user?.username || user?.email}
          </span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-gray-600 hover:text-red-600"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
