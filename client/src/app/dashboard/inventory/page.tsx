"use client";

import { useGetProductsQuery } from "@/state/api/productApi";
import { useGetAllTenantsQuery } from "@/state/api/adminApi";
import Header from "@/app/(components)/Header";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useSelector } from "react-redux";
import { selectIsDarkMode } from "@/state/slices/global/selectors";
import { Box, MenuItem, FormControl, InputLabel, Select, TextField } from "@mui/material";
import { useState } from "react";
import { useAppSelector } from "@/state/store";
import { useGetTenantDetailsQuery } from "@/state/api/tenantApi";

const columns: GridColDef[] = [
  { field: "productId", headerName: "ID", width: 90 },
  { field: "name", headerName: "Product Name", width: 200 },
  {
    field: "price",
    headerName: "Price",
    width: 110,
    type: "number",
    valueGetter: (value, row) => `$${row.price}`,
  },
  {
    field: "rating",
    headerName: "Rating",
    width: 110,
    type: "number",
    valueGetter: (value, row) => (row.rating ? row.rating : "N/A"),
  },
  {
    field: "stockQuantity",
    headerName: "Stock Quantity",
    width: 150,
    type: "number",
  },
];

const Inventory = () => {
  const [selectedTenantId, setSelectedTenantId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useAppSelector((state) => state.auth);
  const isDarkMode = useSelector(selectIsDarkMode);
  
  // Fetch data based on user role
  const isAdmin = user?.role === "ADMIN";
  const isTenant = user?.role === "TENANT";
  
  // For admin: fetch all tenants
  const { data: tenantsData } = useGetAllTenantsQuery(undefined, {
    skip: !isAdmin,
  });
  
  // For tenant: fetch tenant details
  const { data: tenantDetails } = useGetTenantDetailsQuery(undefined, {
    skip: !isTenant,
  });
  
  // Set query parameters based on role and filters
  const queryParams = isAdmin && selectedTenantId 
    ? { tenantId: selectedTenantId } 
    : isTenant && tenantDetails?.tenant
    ? { tenantId: tenantDetails.tenant.tenantId }
    : {};
  
  // Fetch products based on role and filters
  const { data: products, isError, isLoading } = useGetProductsQuery(queryParams);

  // Filter products by search term
  const filteredProducts = products?.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return <div className="py-4">Loading...</div>;
  }

  if (isError || !products) {
    return (
      <div className="text-center text-red-500 py-4">
        Failed to fetch products
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <Header name={isAdmin ? "All Inventory" : "My Inventory"} />
      
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <TextField
          label="Search Products"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ 
            minWidth: 200,
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
        
        {isAdmin && tenantsData?.tenants && (
          <FormControl 
            variant="outlined" 
            size="small"
            sx={{ 
              minWidth: 200,
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.23)' : 'rgba(0, 0, 0, 0.23)',
                },
              },
              '& .MuiInputLabel-root': {
                color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
              },
              '& .MuiSelect-select': {
                color: isDarkMode ? 'white' : 'inherit',
              }
            }}
          >
            <InputLabel>Business</InputLabel>
            <Select
              value={selectedTenantId || ""}
              onChange={(e) => setSelectedTenantId(e.target.value as string || null)}
              label="Business"
            >
              <MenuItem value="">All Businesses</MenuItem>
              {tenantsData.tenants.map((tenant) => (
                <MenuItem key={tenant.tenantId} value={tenant.tenantId}>
                  {tenant.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </div>
      
      {/* Empty state */}
      {filteredProducts?.length === 0 && (
        <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <div className="flex flex-col items-center">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">No products found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
              {searchTerm 
                ? "No products match your search criteria. Try a different search term."
                : "No products available in the inventory."}
            </p>
          </div>
        </div>
      )}
      
      {/* Data grid */}
      {filteredProducts && filteredProducts.length > 0 && (
        <Box
          sx={{
            height: 500,
            width: '100%',
            mt: 2,
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
              '&.Mui-selected': {
                backgroundColor: isDarkMode ? 'rgba(144, 202, 249, 0.16)' : 'rgba(25, 118, 210, 0.08)',
                '&:hover': {
                  backgroundColor: isDarkMode ? 'rgba(144, 202, 249, 0.24)' : 'rgba(25, 118, 210, 0.12)',
                },
              },
            },
            '& .MuiCheckbox-root': {
              color: isDarkMode ? '#90caf9' : '#1976d2',
            },
            '& .MuiTablePagination-root': {
              color: isDarkMode ? '#e0e0e0' : 'inherit',
            },
          }}
        >
          <DataGrid
            rows={filteredProducts}
            columns={columns}
            getRowId={(row) => row.productId}
            checkboxSelection
          />
        </Box>
      )}
    </div>
  );
};

export default Inventory;