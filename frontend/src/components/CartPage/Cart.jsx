import React, { useEffect, useState } from "react";
import api from "@/utils/api";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingCart,
  Loader2,
} from "lucide-react";

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // 🧠 Lấy user từ localStorage
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

  // 🛒 Lấy giỏ hàng
  const fetchCart = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const res = await api.get(`/carts/${user.id}`);
      setCart(res.data?.cart || { items: [], totalPrice: 0 });
    } catch (err) {
      console.error("Lỗi khi lấy giỏ hàng:", err);
      setCart({ items: [], totalPrice: 0 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) fetchCart();
  }, [user]);

  // ➕➖ Cập nhật số lượng
  const updateQuantity = async (productId, newQty) => {
    if (newQty < 1) return;
    try {
      await api.put(`/carts/${user.id}/${productId}`, { quantity: newQty });
      fetchCart();
    } catch (err) {
      console.error("Lỗi khi cập nhật số lượng:", err);
    }
  };

  // 🗑 Xóa 1 sản phẩm
  const removeItem = async (productId) => {
    try {
      await api.delete(`/carts/${user.id}/${productId}`);
      fetchCart();
    } catch (err) {
      console.error("Lỗi khi xóa sản phẩm:", err);
    }
  };

  // 🧹 Xóa toàn bộ
  const clearCart = async () => {
    try {
      await api.delete(`/carts/${user.id}/clear/all`);
      fetchCart();
    } catch (err) {
      console.error("Lỗi khi xóa toàn bộ giỏ hàng:", err);
    }
  };

  // 💬 Hiển thị
  if (loading)
    return (
      <div className="flex justify-center py-20 text-gray-500 text-lg">
        <Loader2 className="animate-spin mr-2" /> Đang tải giỏ hàng...
      </div>
    );

  if (!cart || cart.items?.length === 0)
    return (
      <div className="flex flex-col items-center py-20 text-gray-500 text-lg">
        <ShoppingCart className="w-12 h-12 mb-3" />
        Giỏ hàng của bạn đang trống.
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Tiêu đề + nút xóa tất cả */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <ShoppingCart className="w-6 h-6 text-blue-600" />
          Giỏ hàng của bạn
        </h2>
        <button
          onClick={clearCart}
          className="flex items-center gap-2 text-red-500 hover:text-red-700"
        >
          <Trash2 className="w-5 h-5" /> Xóa tất cả
        </button>
      </div>

      {/* Danh sách sản phẩm */}
      <div className="bg-white shadow-md rounded-xl p-5 mb-6">
        <div className="flex flex-col gap-5">
          {cart.items.map((item) => (
            <div
              key={item.product?._id}
              className="flex items-center justify-between border-b pb-4"
            >
              <div className="flex items-center gap-4">
                <img
                  src={
                    item.product?.img?.[0] ||
                    item.product?.img ||
                    "/placeholder.jpg"
                  }
                  alt={item.product?.productName}
                  className="w-20 h-20 object-cover rounded-lg border"
                />
                <div>
                  <h3 className="font-medium text-lg">
                    {item.product?.productName}
                  </h3>
                  <p className="text-gray-500">
                    {new Intl.NumberFormat("vi-VN").format(
                      item.product?.price
                    )}
                    ₫
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                {/* Nút tăng giảm */}
                <div className="flex items-center border rounded-lg overflow-hidden">
                  <button
                    onClick={() =>
                      updateQuantity(item.product?._id, item.quantity - 1)
                    }
                    className="px-3 py-2 hover:bg-gray-100"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-2 border-x">{item.quantity}</span>
                  <button
                    onClick={() =>
                      updateQuantity(item.product?._id, item.quantity + 1)
                    }
                    className="px-3 py-2 hover:bg-gray-100"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Thành tiền */}
                <div className="text-blue-600 font-semibold w-24 text-right">
                  {new Intl.NumberFormat("vi-VN").format(
                    item.quantity * item.product?.price
                  )}
                  ₫
                </div>

                {/* Nút xóa */}
                <button
                  onClick={() => removeItem(item.product?._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tổng kết */}
      <div className="bg-white shadow-md rounded-xl p-5">
        <h3 className="text-lg font-semibold mb-4">Tổng kết đơn hàng</h3>
        <div className="flex justify-between text-gray-600 mb-2">
          <span>Tổng cộng:</span>
          <span className="text-black font-semibold">
            {new Intl.NumberFormat("vi-VN").format(cart.totalPrice)}₫
          </span>
        </div>
        <div className="mt-5 text-right">
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
            Tiếp tục thanh toán →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
