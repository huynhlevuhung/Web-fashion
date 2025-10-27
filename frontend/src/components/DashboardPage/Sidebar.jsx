import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Store,
  Package,
  CreditCard,
  BarChart2,
  Settings,
} from "lucide-react";

const Sidebar = () => {
  const menuItems = [
  { name: "Dashboard", path: "/dashboard/dashboard", icon: <LayoutDashboard size={18} /> },
  { name: "Users", path: "/dashboard/users", icon: <Users size={18} /> },
  { name: "Stores", path: "/dashboard/stores", icon: <Store size={18} /> }, // nếu bạn có route stores
  { name: "Products", path: "/dashboard/products", icon: <Package size={18} /> },
  { name: "Transactions", path: "/dashboard/transactions", icon: <CreditCard size={18} /> },
  { name: "Reports", path: "/dashboard/reports", icon: <BarChart2 size={18} /> }, // thêm nếu có route reports
  { name: "Settings", path: "/dashboard/settings", icon: <Settings size={18} /> },
];

  return (
    <aside className="h-screen w-60 bg-gray-900 text-gray-100 flex flex-col">
      {/* Logo / App Name */}
      <div className="px-6 py-4 text-xl font-bold border-b border-gray-800">
        Admin
      </div>

      {/* Menu Items */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors
              ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`
            }
          >
            {item.icon}
            {item.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
