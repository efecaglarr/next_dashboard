"use client";

import { useState } from "react";
import { useAppSelector } from "@/state/store";
import { useGetTenantDetailsQuery, useUpdateTenantMutation } from "@/state/api/tenantApi";
import Header from "@/app/(components)/Header";
import { Box, Button, Card, CardContent, Divider, Grid, TextField, Typography, Switch, FormControlLabel, Alert } from "@mui/material";
import { Save, Building, User, Mail, Phone, Globe, Shield } from "lucide-react";
import { useSelector } from "react-redux";
import { selectIsDarkMode } from "@/state/slices/global/selectors";

const SettingsPage = () => {
  const { user } = useAppSelector((state) => state.auth);
  const isDarkMode = useSelector(selectIsDarkMode);
  const isAdmin = user?.role === "ADMIN";
  const isTenant = user?.role === "TENANT";
  
  // For tenant: fetch tenant details
  const { data: tenantData, isLoading: isLoadingTenant } = useGetTenantDetailsQuery(undefined, {
    skip: !isTenant,
  });
  
  const [updateTenant] = useUpdateTenantMutation();
  
  const [formData, setFormData] = useState({
    name: tenantData?.tenant?.name || "",
    subDomain: tenantData?.tenant?.subDomain || "",
    phoneNumber: tenantData?.tenant?.phoneNumber || "",
    notifications: true,
    darkMode: isDarkMode,
    twoFactorAuth: false,
  });
  
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: e.target.type === "checkbox" ? checked : value,
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isTenant) {
        await updateTenant({
          name: formData.name,
          subDomain: formData.subDomain,
          phoneNumber: formData.phoneNumber,
        }).unwrap();
        setSuccessMessage("Business settings updated successfully!");
      } else {
        // For regular users and admins, just show a success message
        setSuccessMessage("Settings updated successfully!");
      }
      
      setErrorMessage("");
    } catch (error) {
      setErrorMessage("Failed to update settings. Please try again.");
      setSuccessMessage("");
    }
  };
  
  if (isLoadingTenant && isTenant) {
    return <div className="py-4">Loading...</div>;
  }
  
  return (
    <div className="flex flex-col">
      <Header name="Settings" />
      
      {successMessage && (
        <Alert severity="success" className="mb-4" onClose={() => setSuccessMessage("")}>
          {successMessage}
        </Alert>
      )}
      
      {errorMessage && (
        <Alert severity="error" className="mb-4" onClose={() => setErrorMessage("")}>
          {errorMessage}
        </Alert>
      )}
      
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Grid container spacing={3}>
          {/* Account Settings */}
          <Grid item xs={12} md={6}>
            <Card 
              variant="outlined"
              sx={{ 
                bgcolor: isDarkMode ? 'rgba(0, 0, 0, 0.2)' : 'white',
                borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
              }}
            >
              <CardContent>
                <Typography variant="h6" component="h2" className="flex items-center gap-2 mb-4">
                  <User size={20} />
                  Account Settings
                </Typography>
                
                <div className="space-y-4">
                  <TextField
                    fullWidth
                    label="Email"
                    value={user?.email || ""}
                    disabled
                    InputProps={{
                      startAdornment: <Mail size={18} className="mr-2 text-gray-500" />,
                    }}
                    sx={{ 
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.23)' : 'rgba(0, 0, 0, 0.23)',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                      },
                      '& .MuiInputBase-input': {
                        color: isDarkMode ? 'white' : 'inherit',
                      }
                    }}
                  />
                  
                  <TextField
                    fullWidth
                    label="Username"
                    value={user?.username || ""}
                    disabled
                    InputProps={{
                      startAdornment: <User size={18} className="mr-2 text-gray-500" />,
                    }}
                    sx={{ 
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.23)' : 'rgba(0, 0, 0, 0.23)',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                      },
                      '& .MuiInputBase-input': {
                        color: isDarkMode ? 'white' : 'inherit',
                      }
                    }}
                  />
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.notifications}
                        onChange={handleChange}
                        name="notifications"
                        color="primary"
                      />
                    }
                    label="Email Notifications"
                  />
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.darkMode}
                        onChange={handleChange}
                        name="darkMode"
                        color="primary"
                      />
                    }
                    label="Dark Mode"
                  />
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.twoFactorAuth}
                        onChange={handleChange}
                        name="twoFactorAuth"
                        color="primary"
                      />
                    }
                    label="Two-Factor Authentication"
                  />
                </div>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Business Settings (Tenant Only) */}
          {isTenant && (
            <Grid item xs={12} md={6}>
              <Card 
                variant="outlined"
                sx={{ 
                  bgcolor: isDarkMode ? 'rgba(0, 0, 0, 0.2)' : 'white',
                  borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
                }}
              >
                <CardContent>
                  <Typography variant="h6" component="h2" className="flex items-center gap-2 mb-4">
                    <Building size={20} />
                    Business Settings
                  </Typography>
                  
                  <div className="space-y-4">
                    <TextField
                      fullWidth
                      label="Business Name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      InputProps={{
                        startAdornment: <Building size={18} className="mr-2 text-gray-500" />,
                      }}
                      sx={{ 
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.23)' : 'rgba(0, 0, 0, 0.23)',
                          },
                        },
                        '& .MuiInputLabel-root': {
                          color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                        },
                        '& .MuiInputBase-input': {
                          color: isDarkMode ? 'white' : 'inherit',
                        }
                      }}
                    />
                    
                    <TextField
                      fullWidth
                      label="Subdomain"
                      name="subDomain"
                      value={formData.subDomain}
                      onChange={handleChange}
                      InputProps={{
                        startAdornment: <Globe size={18} className="mr-2 text-gray-500" />,
                      }}
                      sx={{ 
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.23)' : 'rgba(0, 0, 0, 0.23)',
                          },
                        },
                        '& .MuiInputLabel-root': {
                          color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                        },
                        '& .MuiInputBase-input': {
                          color: isDarkMode ? 'white' : 'inherit',
                        }
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
                      sx={{ 
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.23)' : 'rgba(0, 0, 0, 0.23)',
                          },
                        },
                        '& .MuiInputLabel-root': {
                          color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                        },
                        '& .MuiInputBase-input': {
                          color: isDarkMode ? 'white' : 'inherit',
                        }
                      }}
                    />
                    
                    <TextField
                      fullWidth
                      label="Subscription Plan"
                      value={tenantData?.tenant?.plan || "FREE"}
                      disabled
                      InputProps={{
                        startAdornment: <Shield size={18} className="mr-2 text-gray-500" />,
                      }}
                      sx={{ 
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.23)' : 'rgba(0, 0, 0, 0.23)',
                          },
                        },
                        '& .MuiInputLabel-root': {
                          color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                        },
                        '& .MuiInputBase-input': {
                          color: isDarkMode ? 'white' : 'inherit',
                        }
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </Grid>
          )}
          
          {/* Security Settings */}
          <Grid item xs={12} md={isTenant ? 12 : 6}>
            <Card 
              variant="outlined"
              sx={{ 
                bgcolor: isDarkMode ? 'rgba(0, 0, 0, 0.2)' : 'white',
                borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
              }}
            >
              <CardContent>
                <Typography variant="h6" component="h2" className="flex items-center gap-2 mb-4">
                  <Shield size={20} />
                  Security Settings
                </Typography>
                
                <div className="space-y-4">
                  <Button
                    variant="outlined"
                    color="primary"
                    fullWidth
                    sx={{ mb: 2 }}
                  >
                    Change Password
                  </Button>
                  
                  <Divider />
                  
                  <Typography variant="body2" color="textSecondary" className="mt-2">
                    Last login: {new Date().toLocaleString()}
                  </Typography>
                </div>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        
        <Button
          type="submit"
          variant="contained"
          color="primary"
          startIcon={<Save />}
          sx={{ mt: 4 }}
        >
          Save Changes
        </Button>
      </Box>
    </div>
  );
};

export default SettingsPage; 