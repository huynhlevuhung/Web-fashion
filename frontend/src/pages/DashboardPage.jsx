import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "../components/DashboardPage/Sidebar";
import Navbar from "../components/HomePage/Navbar";

import DashboardLayout from "../components/DashboardPage/Dashboard/DashboardLayout";
import UserLayout from "../components/DashboardPage/User/UserLayout";
import ProductLayout from "../components/DashboardPage/Product/ProductLayout";
import TransactionLayout from "../components/DashboardPage/Transaction/TransactionLayout";
import SettingsLayout from "../components/DashboardPage/Setting/SettingLayout";

const DashboardPage = () => {
  const [navbarHeight, setNavbarHeight] = useState(0);

  // 🧭 Khi navbar hiển thị (hover), đo lại chiều cao để đẩy nội dung xuống
  useEffect(() => {
    const navbar = document.querySelector(".app-navbar");
    if (!navbar) return;

    const updateHeight = () => {
      const rect = navbar.getBoundingClientRect();
      setNavbarHeight(rect.height);
    };

    updateHeight();

    // Nếu Navbar có hiệu ứng ẩn/hiện, theo dõi kích thước của nó
    const observer = new ResizeObserver(updateHeight);
    observer.observe(navbar);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* 🧩 Sidebar trái */}
      <Sidebar />

      {/* 🧭 Khu vực nội dung */}
      <div className="flex flex-col flex-1 relative">
        {/* Navbar cố định trên đầu */}
        <div className="app-navbar fixed top-0 left-0 right-0 z-30">
          <Navbar />
        </div>

        {/* Phần nội dung chính */}
        <main
          className="flex-1 overflow-y-auto p-6 transition-all duration-300"
          style={{
            marginTop: `${navbarHeight}px`, // Đẩy xuống bằng chiều cao navbar
          }}
        >
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
