"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLoginMutation } from "@/state/api/authApi";
import { LoadingSpinner } from "@/app/(components)/Common/LoadingSpinner";
import { ErrorMessage } from "@/app/(components)/Common/ErrorMessage";
import { GoogleAuthButton } from "@/app/(components)/Auth/GoogleAuthButton";
import { AuthLayout } from "@/app/(components)/Auth/AuthLayout";
import { AuthInput } from "@/app/(components)/Auth/AuthInput";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { setStateCredentials } from "@/state/slices/auth/authSlice";



const LoginPage = () => {
  const [credentials, setCredentials] = useState({
    emailOrUsername: "",
    password: "",
    role: "USER" as const
  });
  
  const router = useRouter();
  const dispatch = useDispatch();
  const [login, { isLoading, error }] = useLoginMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await login(credentials).unwrap();
      if (result?.user && result?.token) {
        dispatch(setStateCredentials(result));
        router.replace("/dashboard");
      }
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/google`);
      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error("Google login failed:", error);
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <AuthLayout 
      title="Welcome Back"
      subtitle={
        <>
          New here?{" "}
          <Link href="/dashboard/register" className="text-blue-600 hover:text-blue-800 font-medium">
            Create an account
          </Link>
        </>
      }
    >
      {error && <ErrorMessage message="Invalid credentials" />}

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
            placeholder="Email or Username"
            value={credentials.emailOrUsername}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
              setCredentials({ ...credentials, emailOrUsername: e.target.value })
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
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium
            hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            transform transition-all duration-200"
        >
          Sign in
        </motion.button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

        <GoogleAuthButton onClick={handleGoogleLogin} text="Sign in with Google" />
      </motion.form>
    </AuthLayout>
  );
};

export default LoginPage;