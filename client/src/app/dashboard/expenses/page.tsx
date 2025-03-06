"use client";

import { useState, useEffect } from "react";
import { useAppSelector } from "@/state/store";
import { useRouter } from "next/navigation";
import Header from "@/app/(components)/Header";
import { Box, Button, Chip, IconButton, Menu, MenuItem, TextField, Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useSelector } from "react-redux";
import { selectIsDarkMode } from "@/state/slices/global/selectors";
import { MoreVertical, Search, DollarSign, PlusCircle, FileText, TrendingUp } from "lucide-react";
import { useGetTenantDetailsQuery } from "@/state/api/tenantApi";

// Mock data for expenses since we don't have an expenses API yet
const mockExpenses = [
  {
    expenseId: "EXP-001",
    category: "Rent",
    amount: 1500.00,
    date: "2023-06-01T00:00:00Z",
    description: "Monthly office rent",
    paymentMethod: "Bank Transfer",
    status: "PAID"
  },
  {
    expenseId: "EXP-002",
    category: "Utilities",
    amount: 250.75,
    date: "2023-06-05T00:00:00Z",
    description: "Electricity and water bills",
    paymentMethod: "Credit Card",
    status: "PAID"
  },
  {
    expenseId: "EXP-003",
    category: "Inventory",
    amount: 3200.50,
    date: "2023-06-10T00:00:00Z",
    description: "Restocking inventory",
    paymentMethod: "Bank Transfer",
    status: "PAID"
  },
  {
    expenseId: "EXP-004",
    category: "Marketing",
    amount: 750.00,
    date: "2023-06-15T00:00:00Z",
    description: "Social media advertising",
    paymentMethod: "Credit Card",
    status: "PENDING"
  },
  {
    expenseId: "EXP-005",
    category: "Salaries",
    amount: 5000.00,
    date: "2023-06-30T00:00:00Z",
    description: "Employee salaries",
    paymentMethod: "Bank Transfer",
    status: "SCHEDULED"
  }
];

// Calculate total expenses
const totalExpenses = mockExpenses.reduce((sum, expense) => sum + expense.amount, 0);

// Group expenses by category
const expensesByCategory = mockExpenses.reduce((acc, expense) => {
  acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
  return acc;
}, {} as Record<string, number>);

interface Expense {
  expenseId: string;
  category: string;
  amount: number;
  date: string;
  description: string;
  paymentMethod: string;
  status: string;
}

const ExpensesPage = () => {
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);
  const isDarkMode = useSelector(selectIsDarkMode);
  const [searchTerm, setSearchTerm] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [isAddExpenseModalOpen, setIsAddExpenseModalOpen] = useState(false);
  
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
  
  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, expense: Expense) => {
    setAnchorEl(event.currentTarget);
    setSelectedExpense(expense);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleViewDetails = () => {
    // Navigate to expense details page
    handleMenuClose();
  };
  
  const handleEditExpense = () => {
    // Open edit expense modal
    handleMenuClose();
  };
  
  const handleDeleteExpense = () => {
    // Delete expense
    handleMenuClose();
  };
  
  const filteredExpenses = mockExpenses.filter(expense => 
    expense.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expense.expenseId.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "PAID":
        return "success";
      case "PENDING":
        return "warning";
      case "SCHEDULED":
        return "info";
      default:
        return "default";
    }
  };
  
  const columns: GridColDef[] = [
    { field: "expenseId", headerName: "ID", width: 100 },
    { field: "category", headerName: "Category", width: 150 },
    { 
      field: "amount", 
      headerName: "Amount", 
      width: 120,
      valueGetter: (params) => {
        try {
          return params.row?.amount ? `$${params.row.amount.toFixed(2)}` : '$0.00';
        } catch (error) {
          return '$0.00';
        }
      }
    },
    { 
      field: "date", 
      headerName: "Date", 
      width: 180,
      valueGetter: (params) => {
        try {
          return params.row?.date ? new Date(params.row.date).toLocaleDateString() : 'N/A';
        } catch (error) {
          return 'N/A';
        }
      }
    },
    { field: "description", headerName: "Description", width: 250 },
    { field: "paymentMethod", headerName: "Payment Method", width: 150 },
    { 
      field: "status", 
      headerName: "Status", 
      width: 120,
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          color={getStatusColor(params.value as string)}
          size="small"
        />
      )
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      renderCell: (params) => (
        <>
          <IconButton onClick={(e) => handleMenuOpen(e, params.row as Expense)}>
            <MoreVertical size={18} />
          </IconButton>
        </>
      )
    }
  ];
  
  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <Header name="Expenses" />
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
            startIcon={<PlusCircle size={18} />}
            onClick={() => setIsAddExpenseModalOpen(true)}
            sx={{ 
              bgcolor: 'primary.main',
              '&:hover': {
                bgcolor: 'primary.dark',
              }
            }}
          >
            Add Expense
          </Button>
        </div>
      </div>
      
      {/* Expense Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow`}>
          <div className="flex items-center">
            <div className={`p-3 rounded-full ${isDarkMode ? 'bg-blue-900' : 'bg-blue-100'} mr-4`}>
              <DollarSign className={`h-6 w-6 ${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`} />
            </div>
            <div>
              <Typography variant="body2" color="textSecondary">Total Expenses</Typography>
              <Typography variant="h6">${totalExpenses.toFixed(2)}</Typography>
            </div>
          </div>
        </div>
        
        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow`}>
          <div className="flex items-center">
            <div className={`p-3 rounded-full ${isDarkMode ? 'bg-green-900' : 'bg-green-100'} mr-4`}>
              <DollarSign className={`h-6 w-6 ${isDarkMode ? 'text-green-300' : 'text-green-600'}`} />
            </div>
            <div>
              <Typography variant="body2" color="textSecondary">Paid Expenses</Typography>
              <Typography variant="h6">
                ${mockExpenses
                  .filter(e => e.status === "PAID")
                  .reduce((sum, e) => sum + e.amount, 0)
                  .toFixed(2)}
              </Typography>
            </div>
          </div>
        </div>
        
        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow`}>
          <div className="flex items-center">
            <div className={`p-3 rounded-full ${isDarkMode ? 'bg-yellow-900' : 'bg-yellow-100'} mr-4`}>
              <DollarSign className={`h-6 w-6 ${isDarkMode ? 'text-yellow-300' : 'text-yellow-600'}`} />
            </div>
            <div>
              <Typography variant="body2" color="textSecondary">Pending Expenses</Typography>
              <Typography variant="h6">
                ${mockExpenses
                  .filter(e => e.status === "PENDING" || e.status === "SCHEDULED")
                  .reduce((sum, e) => sum + e.amount, 0)
                  .toFixed(2)}
              </Typography>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-4">
        <TextField
          label="Search Expenses"
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
          rows={filteredExpenses}
          columns={columns}
          getRowId={(row) => row.expenseId}
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
        <MenuItem onClick={handleEditExpense}>
          Edit Expense
        </MenuItem>
        <MenuItem onClick={handleDeleteExpense} sx={{ color: 'error.main' }}>
          Delete Expense
        </MenuItem>
      </Menu>
      
      {/* Add Expense Modal would go here */}
    </div>
  );
};

export default ExpensesPage; 