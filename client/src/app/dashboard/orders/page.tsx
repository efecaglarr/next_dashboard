"use client";

import { useState, useEffect } from "react";
import { useAppSelector } from "@/state/store";
import { useRouter } from "next/navigation";
import Header from "@/app/(components)/Header";
import { Box, Button, Chip, IconButton, Menu, MenuItem, TextField, Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useSelector } from "react-redux";
import { selectIsDarkMode } from "@/state/slices/global/selectors";
import { MoreVertical, Search, Package, FileText, TrendingUp } from "lucide-react";
import { useGetTenantDetailsQuery } from "@/state/api/tenantApi";

// Mock data for orders since we don't have an orders API yet
const mockOrders = [
  {
    orderId: "ORD-001",
    customerName: "John Doe",
    orderDate: "2023-06-15T10:30:00Z",
    status: "DELIVERED",
    total: 125.99,
    items: 3,
    paymentMethod: "Credit Card",
    shippingAddress: "123 Main St, Anytown, USA"
  },
  {
    orderId: "ORD-002",
    customerName: "Jane Smith",
    orderDate: "2023-06-14T14:45:00Z",
    status: "PROCESSING",
    total: 89.50,
    items: 2,
    paymentMethod: "PayPal",
    shippingAddress: "456 Oak Ave, Somewhere, USA"
  },
  {
    orderId: "ORD-003",
    customerName: "Bob Johnson",
    orderDate: "2023-06-13T09:15:00Z",
    status: "SHIPPED",
    total: 210.75,
    items: 5,
    paymentMethod: "Credit Card",
    shippingAddress: "789 Pine Rd, Nowhere, USA"
  },
  {
    orderId: "ORD-004",
    customerName: "Alice Brown",
    orderDate: "2023-06-12T16:20:00Z",
    status: "DELIVERED",
    total: 45.25,
    items: 1,
    paymentMethod: "PayPal",
    shippingAddress: "101 Elm St, Anywhere, USA"
  },
  {
    orderId: "ORD-005",
    customerName: "Charlie Wilson",
    orderDate: "2023-06-11T11:10:00Z",
    status: "CANCELLED",
    total: 150.00,
    items: 4,
    paymentMethod: "Credit Card",
    shippingAddress: "202 Maple Dr, Everywhere, USA"
  }
];

const OrdersPage = () => {
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);
  const isDarkMode = useSelector(selectIsDarkMode);
  const [searchTerm, setSearchTerm] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  
  // Check if user is tenant
  const isTenant = user?.role === "TENANT";
  
  // For tenant: fetch tenant details
  const { data: tenantData } = useGetTenantDetailsQuery(undefined, {
    skip: !isTenant,
  });
  
  // Check if current user is tenant
  useEffect(() => {
    if (user && user.role !== "TENANT") {
      router.push("/dashboard");
    }
  }, [user, router]);
  
  // If not tenant, don't render the page content
  if (user && user.role !== "TENANT") {
    return null;
  }
  
  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, order: any) => {
    setAnchorEl(event.currentTarget);
    setSelectedOrder(order);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleViewDetails = () => {
    // Navigate to order details page
    handleMenuClose();
  };
  
  const handleUpdateStatus = (status: string) => {
    // Update order status
    handleMenuClose();
  };
  
  const filteredOrders = mockOrders.filter(order => 
    order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.orderId.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "DELIVERED":
        return "success";
      case "PROCESSING":
        return "info";
      case "SHIPPED":
        return "primary";
      case "CANCELLED":
        return "error";
      default:
        return "default";
    }
  };
  
  const columns: GridColDef[] = [
    { field: "orderId", headerName: "Order ID", width: 120 },
    { field: "customerName", headerName: "Customer", width: 180 },
    { 
      field: "orderDate", 
      headerName: "Date", 
      width: 180,
      valueGetter: (params) => {
        try {
          return params.row?.orderDate ? new Date(params.row.orderDate).toLocaleString() : 'N/A';
        } catch (error) {
          return 'N/A';
        }
      }
    },
    { 
      field: "status", 
      headerName: "Status", 
      width: 130,
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          color={getStatusColor(params.value as string)}
          size="small"
        />
      )
    },
    { 
      field: "total", 
      headerName: "Total", 
      width: 120,
      valueGetter: (params) => {
        try {
          return params.row?.total ? `$${params.row.total.toFixed(2)}` : '$0.00';
        } catch (error) {
          return '$0.00';
        }
      }
    },
    { 
      field: "items", 
      headerName: "Items", 
      width: 100,
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
  
  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <Header name="Orders" />
        <div className="flex gap-2">
          <Button 
            variant="outlined" 
            startIcon={<FileText size={18} />}
            sx={{ 
              borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.23)' : 'rgba(0, 0, 0, 0.23)',
              color: isDarkMode ? 'white' : 'inherit',
            }}
          >
            Export
          </Button>
          <Button 
            variant="contained" 
            startIcon={<TrendingUp size={18} />}
            sx={{ 
              bgcolor: 'primary.main',
              '&:hover': {
                bgcolor: 'primary.dark',
              }
            }}
          >
            Analytics
          </Button>
        </div>
      </div>
      
      {/* Order Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow`}>
          <div className="flex items-center">
            <div className={`p-3 rounded-full ${isDarkMode ? 'bg-blue-900' : 'bg-blue-100'} mr-4`}>
              <Package className={`h-6 w-6 ${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`} />
            </div>
            <div>
              <Typography variant="body2" color="textSecondary">Total Orders</Typography>
              <Typography variant="h6">{mockOrders.length}</Typography>
            </div>
          </div>
        </div>
        
        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow`}>
          <div className="flex items-center">
            <div className={`p-3 rounded-full ${isDarkMode ? 'bg-green-900' : 'bg-green-100'} mr-4`}>
              <Package className={`h-6 w-6 ${isDarkMode ? 'text-green-300' : 'text-green-600'}`} />
            </div>
            <div>
              <Typography variant="body2" color="textSecondary">Delivered</Typography>
              <Typography variant="h6">{mockOrders.filter(o => o.status === "DELIVERED").length}</Typography>
            </div>
          </div>
        </div>
        
        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow`}>
          <div className="flex items-center">
            <div className={`p-3 rounded-full ${isDarkMode ? 'bg-yellow-900' : 'bg-yellow-100'} mr-4`}>
              <Package className={`h-6 w-6 ${isDarkMode ? 'text-yellow-300' : 'text-yellow-600'}`} />
            </div>
            <div>
              <Typography variant="body2" color="textSecondary">Processing</Typography>
              <Typography variant="h6">{mockOrders.filter(o => o.status === "PROCESSING").length}</Typography>
            </div>
          </div>
        </div>
        
        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow`}>
          <div className="flex items-center">
            <div className={`p-3 rounded-full ${isDarkMode ? 'bg-red-900' : 'bg-red-100'} mr-4`}>
              <Package className={`h-6 w-6 ${isDarkMode ? 'text-red-300' : 'text-red-600'}`} />
            </div>
            <div>
              <Typography variant="body2" color="textSecondary">Cancelled</Typography>
              <Typography variant="h6">{mockOrders.filter(o => o.status === "CANCELLED").length}</Typography>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-4">
        <TextField
          label="Search Orders"
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
          height: 500,
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
          rows={filteredOrders}
          columns={columns}
          getRowId={(row) => row.orderId}
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
        <MenuItem onClick={handleViewDetails}>
          View Details
        </MenuItem>
        <MenuItem divider />
        <MenuItem disabled>
          <strong>Update Status</strong>
        </MenuItem>
        <MenuItem onClick={() => handleUpdateStatus("PROCESSING")}>
          Mark as Processing
        </MenuItem>
        <MenuItem onClick={() => handleUpdateStatus("SHIPPED")}>
          Mark as Shipped
        </MenuItem>
        <MenuItem onClick={() => handleUpdateStatus("DELIVERED")}>
          Mark as Delivered
        </MenuItem>
        <MenuItem onClick={() => handleUpdateStatus("CANCELLED")}>
          Mark as Cancelled
        </MenuItem>
      </Menu>
    </div>
  );
};

export default OrdersPage; 