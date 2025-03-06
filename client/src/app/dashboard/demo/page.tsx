"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

const DemoDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  // Demo data
  const salesData = [
    { name: "Jan", sales: 4000 },
    { name: "Feb", sales: 3000 },
    { name: "Mar", sales: 5000 },
    { name: "Apr", sales: 2780 },
    { name: "May", sales: 1890 },
    { name: "Jun", sales: 2390 },
  ];

  const inventoryData = [
    { name: "Electronics", value: 400 },
    { name: "Clothing", value: 300 },
    { name: "Food", value: 300 },
    { name: "Books", value: 200 },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  const demoProducts = [
    { id: 1, name: "Smartphone", price: 699, stock: 24 },
    { id: 2, name: "Laptop", price: 1299, stock: 15 },
    { id: 3, name: "Headphones", price: 199, stock: 32 },
    { id: 4, name: "Tablet", price: 499, stock: 18 },
    { id: 5, name: "Smart Watch", price: 299, stock: 27 },
  ];

  const demoEmployees = [
    { id: 1, name: "John Doe", position: "Sales Manager", phone: "555-1234" },
    { id: 2, name: "Jane Smith", position: "Inventory Specialist", phone: "555-5678" },
    { id: 3, name: "Mike Johnson", position: "Customer Support", phone: "555-9012" },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Demo Dashboard</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          This is a demonstration of our inventory management system. Register as a business owner to access all features.
        </p>
        <div className="mt-4">
          <Link href="/register">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Register as a Business Owner
            </motion.button>
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === "overview" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"
          }`}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === "products" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"
          }`}
          onClick={() => setActiveTab("products")}
        >
          Products
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === "employees" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"
          }`}
          onClick={() => setActiveTab("employees")}
        >
          Employees
        </button>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow-md p-6">
        {activeTab === "overview" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Sales Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-3">Monthly Sales</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="sales" fill="#4F46E5" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-3">Inventory Distribution</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={inventoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {inventoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-100">
              <h3 className="text-lg font-medium text-blue-800 mb-2">Features Available to Business Owners</h3>
              <ul className="list-disc pl-5 text-blue-700 space-y-1">
                <li>Real-time inventory tracking</li>
                <li>Employee management and scheduling</li>
                <li>Sales analytics and reporting</li>
                <li>Customer relationship management</li>
                <li>Multi-location support</li>
                <li>Mobile access</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === "products" && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Products Management</h2>
              <button 
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors cursor-not-allowed"
                title="Available for business owners only"
              >
                Add Product
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-100 text-gray-700">
                    <th className="py-3 px-4 text-left">ID</th>
                    <th className="py-3 px-4 text-left">Name</th>
                    <th className="py-3 px-4 text-left">Price</th>
                    <th className="py-3 px-4 text-left">Stock</th>
                    <th className="py-3 px-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {demoProducts.map((product) => (
                    <tr key={product.id} className="border-b border-gray-200">
                      <td className="py-3 px-4">{product.id}</td>
                      <td className="py-3 px-4">{product.name}</td>
                      <td className="py-3 px-4">${product.price}</td>
                      <td className="py-3 px-4">{product.stock}</td>
                      <td className="py-3 px-4">
                        <button 
                          className="text-blue-600 hover:text-blue-800 mr-2 cursor-not-allowed"
                          title="Available for business owners only"
                        >
                          Edit
                        </button>
                        <button 
                          className="text-red-600 hover:text-red-800 cursor-not-allowed"
                          title="Available for business owners only"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-6 bg-yellow-50 p-4 rounded-lg border border-yellow-100">
              <p className="text-yellow-800">
                <span className="font-bold">Note:</span> This is a demo view. Register as a business owner to add, edit, and manage your own products.
              </p>
            </div>
          </div>
        )}

        {activeTab === "employees" && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Employee Management</h2>
              <button 
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors cursor-not-allowed"
                title="Available for business owners only"
              >
                Add Employee
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-100 text-gray-700">
                    <th className="py-3 px-4 text-left">ID</th>
                    <th className="py-3 px-4 text-left">Name</th>
                    <th className="py-3 px-4 text-left">Position</th>
                    <th className="py-3 px-4 text-left">Phone</th>
                    <th className="py-3 px-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {demoEmployees.map((employee) => (
                    <tr key={employee.id} className="border-b border-gray-200">
                      <td className="py-3 px-4">{employee.id}</td>
                      <td className="py-3 px-4">{employee.name}</td>
                      <td className="py-3 px-4">{employee.position}</td>
                      <td className="py-3 px-4">{employee.phone}</td>
                      <td className="py-3 px-4">
                        <button 
                          className="text-blue-600 hover:text-blue-800 mr-2 cursor-not-allowed"
                          title="Available for business owners only"
                        >
                          Edit
                        </button>
                        <button 
                          className="text-red-600 hover:text-red-800 cursor-not-allowed"
                          title="Available for business owners only"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-6 bg-yellow-50 p-4 rounded-lg border border-yellow-100">
              <p className="text-yellow-800">
                <span className="font-bold">Note:</span> This is a demo view. Register as a business owner to add, edit, and manage your own employees.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DemoDashboard; 