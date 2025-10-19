import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "../components/DashboardPage/Sidebar";
import Navbar from "../components/HomePage/Navbar";

import DashboardLayout from "../components/DashboardPage/Dashboard/DashboardLayout";
import UserLayout from "../components/DashboardPage/User/UserLayout";
import ProductLayout from "../components/DashboardPage/Product/ProductLayout";
import TransactionLayout from "../components/DashboardPage/Transaction/TransactionLayout";
import SettingsLayout from "../components/DashboardPage/Setting/SettingLayout";

const DashboardPage = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex flex-col flex-1 left">
        <Navbar />

        <main className="p-6 overflow-y-auto">
          <Routes>
            {/* Khi vào /dashboard thì redirect sang /dashboard/dashboard */}
            <Route index element={<Navigate to="dashboard" replace />} />

            <Route path="dashboard" element={<DashboardLayout />} />
            <Route path="users" element={<UserLayout />} />
            <Route path="products" element={<ProductLayout />} />
            <Route path="transactions" element={<TransactionLayout />} />
            <Route path="settings" element={<SettingsLayout />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
