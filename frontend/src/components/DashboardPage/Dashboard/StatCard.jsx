import React from "react";
import { Users, CreditCard, DollarSign } from "lucide-react";

const StatCard = ({ title, value, color, icon: Icon }) => {
  return (
    <div className={`flex items-center gap-4 rounded-lg shadow-md p-6 text-white ${color}`}>


      {/* Text */}
      <div>
        <h3 className="text-sm font-medium">{title}</h3>
        <p className="text-2xl font-bold">{value}</p>
      </div>

      <div className="p-3 bg-white/20 rounded-full">
        <Icon className="w-6 h-6" />
      </div>

    </div>
  );
};

export default StatCard;
