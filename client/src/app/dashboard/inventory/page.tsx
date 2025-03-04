"use client";

import { useGetProductsQuery } from "@/state/api/productApi";
import Header from "@/app/(components)/Header";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useSelector } from "react-redux";
import { selectIsDarkMode } from "@/state/slices/global/selectors";
import { Box } from "@mui/material";

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
  const { data: products, isError, isLoading } = useGetProductsQuery();
  const isDarkMode = useSelector(selectIsDarkMode);

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
      <Header name="Inventory" />
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
          rows={products}
          columns={columns}
          getRowId={(row) => row.productId}
          checkboxSelection
        />
      </Box>
    </div>
  );
};

export default Inventory;