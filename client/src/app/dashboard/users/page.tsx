"use client";

import { useState, useEffect } from "react";
import { useGetAllUsersQuery, useUpdateUserRoleMutation, useUpdateUserStatusMutation } from "@/state/api/adminApi";
import Header from "@/app/(components)/Header";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { useSelector } from "react-redux";
import { selectIsDarkMode } from "@/state/slices/global/selectors";
import { Box, Button, Chip, IconButton, Menu, MenuItem, TextField } from "@mui/material";
import { MoreVertical, UserPlus, Search } from "lucide-react";
import { useAppSelector } from "@/state/store";
import { useRouter } from "next/navigation";

interface User {
  userId: string;
  username: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const UsersPage = () => {
  const router = useRouter();
  const { user: currentUser } = useAppSelector((state) => state.auth);
  const isDarkMode = useSelector(selectIsDarkMode);
  const [searchTerm, setSearchTerm] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  // These hooks must be called unconditionally
  const { data, isLoading, isError } = useGetAllUsersQuery();
  const [updateUserRole] = useUpdateUserRoleMutation();
  const [updateUserStatus] = useUpdateUserStatusMutation();
  
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
  
  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, user: User) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleRoleChange = async (role: string) => {
    if (selectedUser) {
      await updateUserRole({ userId: selectedUser.userId, role });
      handleMenuClose();
    }
  };
  
  const handleStatusChange = async (status: string) => {
    if (selectedUser) {
      await updateUserStatus({ userId: selectedUser.userId, status });
      handleMenuClose();
    }
  };
  
  const filteredUsers = data?.users?.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];
  
  const columns: GridColDef[] = [
    { field: "userId", headerName: "ID", width: 90 },
    { field: "username", headerName: "Username", width: 150 },
    { field: "email", headerName: "Email", width: 200 },
    { 
      field: "role", 
      headerName: "Role", 
      width: 120,
      renderCell: (params: GridRenderCellParams<any, string>) => (
        <Chip 
          label={params.value} 
          color={
            params.value === "ADMIN" ? "error" : 
            params.value === "TENANT" ? "success" : "primary"
          }
          size="small"
        />
      )
    },
    { 
      field: "status", 
      headerName: "Status", 
      width: 120,
      renderCell: (params: GridRenderCellParams<any, string>) => (
        <Chip 
          label={params.value} 
          color={params.value === "ACTIVE" ? "success" : "error"}
          size="small"
        />
      )
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
      renderCell: (params: GridRenderCellParams<any>) => (
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
        Failed to fetch users
      </div>
    );
  }
  
  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <Header name="User Management" />
        <Button 
          variant="contained" 
          startIcon={<UserPlus size={18} />}
          sx={{ 
            bgcolor: 'primary.main',
            '&:hover': {
              bgcolor: 'primary.dark',
            }
          }}
        >
          Add User
        </Button>
      </div>
      
      <div className="mb-4">
        <TextField
          label="Search Users"
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
          rows={filteredUsers}
          columns={columns}
          getRowId={(row) => row.userId}
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
          <strong>Change Role</strong>
        </MenuItem>
        <MenuItem onClick={() => handleRoleChange("ADMIN")}>
          Make Admin
        </MenuItem>
        <MenuItem onClick={() => handleRoleChange("TENANT")}>
          Make Business Owner
        </MenuItem>
        <MenuItem onClick={() => handleRoleChange("USER")}>
          Make Regular User
        </MenuItem>
        <MenuItem divider />
        <MenuItem disabled>
          <strong>Change Status</strong>
        </MenuItem>
        <MenuItem onClick={() => handleStatusChange("ACTIVE")}>
          Activate User
        </MenuItem>
        <MenuItem onClick={() => handleStatusChange("INACTIVE")}>
          Deactivate User
        </MenuItem>
      </Menu>
    </div>
  );
};

export default UsersPage; 