import React, { useEffect, useState } from "react";
import api from "@/utils/api";
import { Package, Calendar, Truck, ClipboardList, ShoppingBag } from "lucide-react";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // 🧠 Lấy user đang đăng nhập
  useEffect(() => {
    const loadUser = () => {
      try {
        const storedUser = localStorage.getItem("user");
        setUser(storedUser ? JSON.parse(storedUser) : null);
      } catch {
        setUser(null);
      }
    };
    loadUser();
    window.addEventListener("storage", loadUser);
    window.addEventListener("userUpdated", loadUser);
    return () => {
      window.removeEventListener("storage", loadUser);
      window.removeEventListener("userUpdated", loadUser);
    };
  }, []);

  // 📦 Lấy danh sách đơn hàng của người mua
  const fetchOrders = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const res = await api.get(`/orders/active/${user.id}`);
      
      setOrders(res.data?.data || []);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách đơn hàng:", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) fetchOrders();
  }, [user]);

  // 💬 Hiển thị
  if (loading)
    return (
      <div className="flex justify-center py-20 text-gray-500 text-lg">
        Đang tải đơn hàng...
      </div>
    );

  if (!orders || orders.length === 0)
    return (
      <div className="flex justify-center py-20 text-gray-500 text-lg">
        Bạn chưa có đơn hàng nào.
      </div>
    );

  return (
    <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Danh sách đơn hàng */}
      <div className="lg:col-span-2 flex flex-col gap-5">
        <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
          <ClipboardList className="text-blue-600" /> Đơn hàng của bạn
        </h2>

        {orders.map((order) => (
          <div
            key={order._id}
            className="border rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition-all duration-300"
          >
            <div className="flex justify-between items-center border-b pb-2 mb-3">
              <div className="flex items-center gap-2 text-gray-700">
                <Package size={18} />
                <span className="font-medium">Mã đơn: {order._id.slice(-6)}</span>
              </div>
              <span
                className={`text-sm font-semibold px-3 py-1 rounded-full ${
                  order.status === "đang chờ"
                    ? "bg-yellow-100 text-yellow-700"
                    : order.status === "đang vận chuyển"
                    ? "bg-blue-100 text-blue-700"
                    : order.status === "đã nhận"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {order.status}
              </span>
            </div>

            {/* Danh sách sản phẩm */}
            <div className="flex flex-col gap-3">
              {order.products.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 border-b last:border-none pb-3"
                >
                  <img
                    src={
                      item.product?.img?.[0] ||
                      item.product?.img ||
                      "/placeholder.jpg"
                    }
                    alt={item.product?.productName}
                    className="w-20 h-20 object-cover rounded-md"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800">
                      {item.product?.productName}
                    </h3>
                    <p className="text-gray-500 text-sm">
                      {item.quantity} x{" "}
                      {new Intl.NumberFormat("vi-VN").format(item.price)}₫
                    </p>
                  </div>
                  <div className="font-semibold text-blue-600">
                    {new Intl.NumberFormat("vi-VN").format(
                      item.quantity * item.price
                    )}
                    ₫
                  </div>
                </div>
              ))}
            </div>

            {/* Thông tin phụ */}
            <div className="flex justify-between items-center mt-3 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar size={16} />{" "}
                <span>
                  Ngày đặt:{" "}
                  {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Truck size={16} />{" "}
                <span>
                  Giao dự kiến:{" "}
                  {new Date(order.promisedDeliveryDate).toLocaleDateString(
                    "vi-VN"
                  )}
                </span>
              </div>
            </div>

            {/* Tổng tiền */}
            <div className="text-right mt-3 font-semibold text-lg text-green-600">
              Tổng:{" "}
              {new Intl.NumberFormat("vi-VN").format(order.totalPrice)}₫
            </div>
          </div>
        ))}
      </div>

      {/* Tổng kết đơn hàng */}
      <div className="h-fit bg-white border rounded-xl shadow-sm p-5">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <ShoppingBag className="text-green-600" /> Tổng kết đơn hàng
        </h3>
        <div className="text-gray-600 space-y-2">
          <p>
            Tổng số đơn hàng:{" "}
            <span className="font-medium text-gray-800">{orders.length}</span>
          </p>
          <p>
            Tổng giá trị:{" "}
            <span className="font-semibold text-green-600">
              {new Intl.NumberFormat("vi-VN").format(
                orders.reduce((sum, o) => sum + o.totalPrice, 0)
              )}
              ₫
            </span>
          </p>
        </div>
        <button className="mt-5 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-all">
          Tiếp tục thanh toán
        </button>
      </div>
    </div>
  );
};

export default Order;
