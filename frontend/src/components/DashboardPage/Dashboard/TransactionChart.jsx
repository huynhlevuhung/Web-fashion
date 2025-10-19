import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Data mẫu, bạn có thể thay bằng dữ liệu từ MongoDB
const data = [
  { name: "Tháng 1", value: 4000 },
  { name: "Tháng 2", value: 3000 },
  { name: "Tháng 3", value: 2000 },
  { name: "Tháng 4", value: 2780 },
];

const TransactionChart = () => {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-md">
      <h2 className="text-lg font-semibold mb-4">Biểu đồ giao dịch</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#4f46e5" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TransactionChart;
