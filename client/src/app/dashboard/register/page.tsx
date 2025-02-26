"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useRegisterMutation } from "@/state/api/authApi";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ErrorMessage } from "@/components/common/ErrorMessage";
import { GoogleAuthButton } from "@/components/auth/GoogleAuthButton";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthInput } from "@/components/auth/AuthInput";
import { motion } from "framer-motion";

const RegisterPage = () => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
    username: "",
    role: "USER" as const
  });
  
  const router = useRouter();
  const [register, { isLoading, error }] = useRegisterMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(credentials).unwrap();
      router.push("/dashboard/login?registered=true");
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
          <Link href="/dashboard/login" className="text-blue-600 hover:text-blue-800 font-medium">
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
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium
            hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            transform transition-all duration-200"
        >
          Create Account
        </motion.button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
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