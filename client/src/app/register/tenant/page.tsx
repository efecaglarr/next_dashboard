"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/state/store";
import { useCreateTenantMutation } from "@/state/api/tenantApi";
import { logout } from "@/state/slices/auth/authSlice";
import { Box, Button, Card, CardContent, TextField, Typography, Alert, CircularProgress } from "@mui/material";
import { Building, Store, Globe, Phone } from "lucide-react";
import Header from "@/app/(components)/Header";

const TenantRegistrationPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, token, isTenantRegistration } = useAppSelector((state) => state.auth);
  const [createTenant, { isLoading, error }] = useCreateTenantMutation();
  
  const [formData, setFormData] = useState({
    name: "",
    subDomain: "",
    phoneNumber: "",
    plan: "FREE"
  });
  
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  
  // Redirect if not in tenant registration flow
  useEffect(() => {
    if (!user || !token || !isTenantRegistration) {
      router.push("/register");
    }
  }, [user, token, isTenantRegistration, router]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    
    try {
      // Validate form
      if (!formData.name || !formData.subDomain) {
        setErrorMessage("Business name and subdomain are required");
        return;
      }
      
      // Create tenant
      const result = await createTenant(formData).unwrap();
      console.log("Tenant created:", result);
      
      setSuccessMessage("Business account created successfully! Redirecting to dashboard...");
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (err: any) {
      console.error("Tenant registration failed:", err);
      setErrorMessage(err.data?.message || "Failed to create business account. Please try again.");
    }
  };
  
  const handleCancel = () => {
    // Log out and redirect to register
    dispatch(logout());
    router.push("/register");
  };
  
  if (!user || !token) {
    return null;
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="max-w-md w-full shadow-lg dark:bg-gray-800">
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <Typography variant="h5" component="h1" className="font-bold">
              Complete Your Business Account
            </Typography>
            <Typography variant="body2" color="textSecondary" className="mt-1">
              Please provide your business details to complete registration
            </Typography>
          </div>
          
          {successMessage && (
            <Alert severity="success" className="mb-4">
              {successMessage}
            </Alert>
          )}
          
          {errorMessage && (
            <Alert severity="error" className="mb-4">
              {errorMessage}
            </Alert>
          )}
          
          {error && (
            <Alert severity="error" className="mb-4">
              {(error as any).data?.message || "An error occurred during registration"}
            </Alert>
          )}
          
          <Box component="form" onSubmit={handleSubmit} className="space-y-4">
            <TextField
              fullWidth
              label="Business Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              InputProps={{
                startAdornment: <Building size={18} className="mr-2 text-gray-500" />,
              }}
            />
            
            <TextField
              fullWidth
              label="Subdomain"
              name="subDomain"
              value={formData.subDomain}
              onChange={handleChange}
              required
              helperText="This will be used for your business URL"
              InputProps={{
                startAdornment: <Globe size={18} className="mr-2 text-gray-500" />,
              }}
            />
            
            <TextField
              fullWidth
              label="Phone Number"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              InputProps={{
                startAdornment: <Phone size={18} className="mr-2 text-gray-500" />,
              }}
            />
            
            <div className="flex gap-4 pt-4">
              <Button
                variant="outlined"
                color="inherit"
                fullWidth
                onClick={handleCancel}
                disabled={isLoading}
              >
                Cancel
              </Button>
              
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={isLoading}
                startIcon={isLoading ? <CircularProgress size={20} /> : <Store size={18} />}
              >
                {isLoading ? "Creating..." : "Complete Registration"}
              </Button>
            </div>
          </Box>
        </CardContent>
      </Card>
    </div>
  );
};

export default TenantRegistrationPage; 