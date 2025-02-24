"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useHandleGoogleCallbackMutation } from "@/state/api/authApi";

const GoogleCallback = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [handleCallback, { isLoading }] = useHandleGoogleCallbackMutation();

  useEffect(() => {
    const code = searchParams.get("code");
    if (code) {
      handleCallback(code)
        .unwrap()
        .then(() => {
          router.push("/dashboard");
        })
        .catch((error: Error) => {
          console.error("Google callback failed:", error);
          router.push("/dashboard/login?error=google-auth-failed");
        });
    }
  }, [handleCallback, router, searchParams]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return null;
};

export default GoogleCallback; 