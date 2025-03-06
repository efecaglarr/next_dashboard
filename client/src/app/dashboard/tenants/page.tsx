"use client";

import { useState, useEffect } from "react";
import { useGetAllTenantsQuery, useUpdateTenantPlanMutation } from "@/state/api/adminApi";
import Header from "@/app/(components)/Header";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { useSelector } from "react-redux";
import { selectIsDarkMode } from "@/state/slices/global/selectors";
import { Box, Button, Chip, IconButton, Menu, MenuItem, TextField } from "@mui/material";
import { MoreVertical, Building, Search } from "lucide-react";
import { useAppSelector } from "@/state/store";
import { useRouter } from "next/navigation";

interface Tenant {
  tenantId: string;
  name: string;
  subDomain: string;
  plan: string;
  phoneNumber?: string;
  createdAt: string;
  updatedAt?: string;
  user: {
    userId: string;
    username: string;
    email: string;
  };
}

const TenantsPage = () => {
  const router = useRouter();
  const { user: currentUser } = useAppSelector((state) => state.auth);
  const isDarkMode = useSelector(selectIsDarkMode);
  const [searchTerm, setSearchTerm] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  
  // These hooks must be called unconditionally
  const { data, isLoading, isError } = useGetAllTenantsQuery();
  const [updateTenantPlan] = useUpdateTenantPlanMutation();
  
  // Check if current user is admin
  useEffect(() => {
    if (currentUser && currentUser.role !== "ADMIN") {
      router.push("/dashboard");
    }
  }, [currentUser, router]);
  
  // If not admin, don't render the page content
  if (currentUser && currentUser.role !== "ADMIN") {
    return null;
  }
  
  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, tenant: Tenant) => {
    setAnchorEl(event.currentTarget);
    setSelectedTenant(tenant);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handlePlanChange = async (plan: string) => {
    if (selectedTenant) {
      await updateTenantPlan({ tenantId: selectedTenant.tenantId, plan });
      handleMenuClose();
    }
  };
  
  const filteredTenants = data?.tenants?.filter(tenant => 
    tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.subDomain.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.user.email.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];
  
  const columns: GridColDef[] = [
    { field: "tenantId", headerName: "ID", width: 90 },
    { field: "name", headerName: "Business Name", width: 180 },
    { field: "subDomain", headerName: "Subdomain", width: 150 },
    { 
      field: "plan", 
      headerName: "Plan", 
      width: 120,
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          color={
            params.value === "PREMIUM" ? "success" : 
            params.value === "STANDARD" ? "primary" : 
            "default"
          }
          size="small"
        />
      )
    },
    { field: "phoneNumber", headerName: "Phone", width: 150 },
    { 
      field: "user", 
      headerName: "Owner", 
      width: 180,
      valueGetter: (params) => {
        try {
          return params.row?.user?.username || 'N/A';
        } catch (error) {
          return 'N/A';
        }
      },
    },
    { 
      field: "email", 
      headerName: "Email", 
      width: 200,
      valueGetter: (params) => {
        try {
          return params.row?.user?.email || 'N/A';
        } catch (error) {
          return 'N/A';
        }
      },
    },
    { 
      field: "createdAt", 
      headerName: "Created At", 
      width: 180,
      valueGetter: (params) => {
        try {
          return params.row?.createdAt ? new Date(params.row.createdAt).toLocaleString() : 'N/A';
        } catch (error) {
          return 'N/A';
        }
      }
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      renderCell: (params) => (
        <>
          <IconButton onClick={(e) => handleMenuOpen(e, params.row)}>
            <MoreVertical size={18} />
          </IconButton>
        </>
      )
    }
  ];
  
  if (isLoading) {
    return <div className="py-4">Loading...</div>;
  }
  
  if (isError || !data) {
    return (
      <div className="text-center text-red-500 py-4">
        Failed to fetch tenants
      </div>
    );
  }
  
  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <Header name="Business Management" />
        <Button 
          variant="contained" 
          startIcon={<Building size={18} />}
          sx={{ 
            bgcolor: 'primary.main',
            '&:hover': {
              bgcolor: 'primary.dark',
            }
          }}
        >
          Add Business
        </Button>
      </div>
      
      <div className="mb-4">
        <TextField
          label="Search Businesses"
          variant="outlined"
          size="small"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <Search size={18} className="mr-2 text-gray-500" />,
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
      
      <Box
        sx={{
          height: 600,
          width: '100%',
          '& .MuiDataGrid-root': {
            border: isDarkMode ? '1px solid rgba(81, 81, 81, 1)' : '1px solid rgba(224, 224, 224, 1)',
          },
          '& .MuiDataGrid-cell': {
            borderBottom: isDarkMode ? '1px solid rgba(81, 81, 81, 0.5)' : '1px solid rgba(224, 224, 224, 1)',
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: isDarkMode ? 'rgba(51, 51, 51, 0.8)' : 'rgba(245, 245, 245, 0.8)',
            color: isDarkMode ? '#e0e0e0' : 'inherit',
          },
          '& .MuiDataGrid-row': {
            '&:hover': {
              backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
            },
          },
          '& .MuiTablePagination-root': {
            color: isDarkMode ? '#e0e0e0' : 'inherit',
          },
        }}
      >
        <DataGrid
          rows={filteredTenants}
          columns={columns}
          getRowId={(row) => row.tenantId}
          pageSizeOptions={[10, 25, 50]}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10 },
            },
          }}
        />
      </Box>
      
      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem disabled>
          <strong>Change Plan</strong>
        </MenuItem>
        <MenuItem onClick={() => handlePlanChange("FREE")}>
          Set to Free Plan
        </MenuItem>
        <MenuItem onClick={() => handlePlanChange("STANDARD")}>
          Set to Standard Plan
        </MenuItem>
        <MenuItem onClick={() => handlePlanChange("PREMIUM")}>
          Set to Premium Plan
        </MenuItem>
        <MenuItem divider />
        <MenuItem onClick={() => router.push(`/dashboard/products?tenantId=${selectedTenant?.tenantId}`)}>
          View Products
        </MenuItem>
        <MenuItem onClick={() => router.push(`/dashboard/analytics?tenantId=${selectedTenant?.tenantId}`)}>
          View Analytics
        </MenuItem>
      </Menu>
    </div>
  );
};

export default TenantsPage; 