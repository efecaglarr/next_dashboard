"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useRegisterMutation } from "@/state/api/authApi";
import { useAppDispatch } from "@/state/store";
import { setStateCredentials, setTenantRegistration } from "@/state/slices/auth/authSlice";
import { LoadingSpinner } from "@/app/(components)/Common/LoadingSpinner";
import { ErrorMessage } from "@/app/(components)/Common/ErrorMessage";
import { GoogleAuthButton } from "@/app/(components)/Auth/GoogleAuthButton";
import { AuthLayout } from "@/app/(components)/Auth/AuthLayout";
import { AuthInput } from "@/app/(components)/Auth/AuthInput";
import { motion } from "framer-motion";

const RegisterPage = () => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
    username: "",
    role: "USER" as const,
    isTenant: false
  });
  
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [register, { isLoading, error }] = useRegisterMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await register(credentials).unwrap();
      
      // Store user data in Redux
      dispatch(setStateCredentials({
        user: result.user,
        token: result.token,
        isTenant: credentials.isTenant
      }));
      
      // If registering as a tenant, redirect to tenant registration
      if (credentials.isTenant) {
        dispatch(setTenantRegistration(true));
        router.push("/register/tenant");
      } else {
        router.push("/login?registered=true");
      }
    } catch (err) {
      console.error("Registration failed:", err);
    }
  };

  const handleGoogleRegister = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/google`);
      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error("Google registration failed:", error);
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <AuthLayout 
      title="Create Account"
      subtitle={
        <>
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 hover:text-blue-800 font-medium">
            Sign in
          </Link>
        </>
      }
    >
      {error && <ErrorMessage message="Registration failed. Please try again." />}

      <motion.form 
        onSubmit={handleSubmit}
        className="mt-8 space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div className="space-y-4">
          <AuthInput
            type="text"
            placeholder="Username"
            value={credentials.username}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
              setCredentials({ ...credentials, username: e.target.value })
            }
          />
          <AuthInput
            type="email"
            placeholder="Email address"
            value={credentials.email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
              setCredentials({ ...credentials, email: e.target.value })
            }
          />
          <AuthInput
            type="password"
            placeholder="Password"
            value={credentials.password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
              setCredentials({ ...credentials, password: e.target.value })
            }
          />
          
          <div className="flex items-center mt-4">
            <input
              id="isTenant"
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              checked={credentials.isTenant}
              onChange={(e) => setCredentials({ ...credentials, isTenant: e.target.checked })}
            />
            <label htmlFor="isTenant" className="ml-2 block text-sm text-gray-700">
              Register as a business owner
            </label>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 
            flex items-center justify-center gap-2 border border-blue-600
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            transform transition-all duration-200 font-medium"
        >
          Create Account
        </motion.button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300/70 dark:border-gray-600/70" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 text-gray-500 bg-[#ffffff] dark:bg-gray-900">Or continue with</span>
          </div>
        </div>

        <GoogleAuthButton onClick={handleGoogleRegister} text="Sign up with Google" />

        <motion.p 
          className="mt-4 text-xs text-center text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          By creating an account, you agree to our{" "}
          <Link href="/terms" className="text-blue-600 hover:text-blue-800">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-blue-600 hover:text-blue-800">
            Privacy Policy
          </Link>
        </motion.p>
      </motion.form>
    </AuthLayout>
  );
};

export default RegisterPage; 