// src/components/OrderPage/Order.jsx
import React, { useEffect, useState } from "react";
import api from "@/utils/api";
import {
  Package,
  Calendar,
  Truck,
  ClipboardList,
  ShoppingBag,
  XCircle,
  Repeat,
  MapPin,
  Eye,
} from "lucide-react";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // modal đổi địa chỉ
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalOrderId, setModalOrderId] = useState(null);
  const [modalInput, setModalInput] = useState("");

  // expand notes per order
  const [expandedOrders, setExpandedOrders] = useState(new Set());

  // fetch user từ localStorage
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

  const fetchOrders = async () => {
    if (!user?.id) {
      setOrders([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await api.get(`/orders/active/${user.id}`);
      const data = res.data?.data || [];
      // sort: mới nhất trên cùng
      data.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setOrders(data);
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

  // --- HELPERS -----------------------------------------------------

  const normalizeProductId = (item) => {
    // item.product có thể là object hoặc id
    if (!item) return null;
    if (typeof item.product === "string" || typeof item.product === "number")
      return item.product;
    return item.product?._id || item.product?.id || null;
  };

  const ensureNoteArray = (note) => {
    if (!note) return [];
    if (Array.isArray(note)) return note;
    return [String(note)];
  };

  // toggle expand notes
  const toggleNotes = (orderId) => {
    setExpandedOrders((prev) => {
      const s = new Set(prev);
      if (s.has(orderId)) s.delete(orderId);
      else s.add(orderId);
      return s;
    });
  };

  // --- ACTIONS -----------------------------------------------------

  // Hủy đơn (chỉ đổi status -> 'đã hủy')
  const handleCancelOrder = async (orderId) => {
    if (!user?.id) return alert("Vui lòng đăng nhập");
    if (!confirm("Bạn có chắc muốn hủy đơn này?")) return;

    try {
      setLoading(true);
      await api.put(`/orders/${orderId}`, { status: "đã hủy" });
      await fetchOrders();
      alert("Đã hủy đơn.");
    } catch (err) {
      console.error(err);
      alert("Lỗi khi hủy đơn.");
    } finally {
      setLoading(false);
    }
  };

  // Đổi địa chỉ -> mở modal
  const openChangeAddressModal = (orderId) => {
    setModalOrderId(orderId);
    setModalInput("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalOrderId(null);
    setModalInput("");
  };

  // Lưu note (append) và PUT /orders/:id
  const handleSaveAddress = async () => {
    if (!modalOrderId) return;
    const newNoteStr = modalInput.trim();
    if (!newNoteStr) return alert("Vui lòng nhập địa chỉ/ghi chú.");

    setLoading(true);
    try {
      // find current order to merge notes properly (so we don't override)
      const order = orders.find((o) => (o.id || o._id) === modalOrderId || o._id === modalOrderId || o.id === modalOrderId);
      const currentNotes = ensureNoteArray(order?.note);
      const updatedNotes = [...currentNotes, newNoteStr];

      await api.put(`/orders/${modalOrderId}`, { note: updatedNotes });
      await fetchOrders();
      alert("Đổi địa chỉ / thêm ghi chú thành công.");
      closeModal();
    } catch (err) {
      console.error(err);
      alert("Lỗi khi lưu địa chỉ/ghi chú.");
    } finally {
      setLoading(false);
    }
  };

  // Đặt lại: add tất cả sản phẩm vào cart -> delete order
  const handleReorder = async (order) => {
    if (!user?.id) return alert("Vui lòng đăng nhập");
    if (!confirm("Bạn muốn đặt lại toàn bộ sản phẩm trong đơn này vào giỏ hàng chứ?")) return;

    setLoading(true);
    try {
      // add product by product -> POST /carts/:userId
      for (const item of order.products || []) {
        const productId = normalizeProductId(item);
        if (!productId) {
          console.warn("Không lấy được productId cho item:", item);
          continue;
        }
        // mỗi API có thể khác: mình gửi productId và quantity; nếu backend cần khác hãy chỉnh
        await api.post(`/carts/${user.id}`, {
          productId,
          quantity: item.quantity || 1,
          price: item.price, // optional
        });
      }

      // sau khi add xong, xóa order cũ
      await api.delete(`/orders/${order.id || order._id}`);

      // refresh
      await fetchOrders();
      alert("Đã thêm vào giỏ và xóa đơn cũ.");
    } catch (err) {
      console.error("Lỗi khi đặt lại:", err);
      alert("Có lỗi khi đặt lại. Kiểm tra console.");
    } finally {
      setLoading(false);
    }
  };

  // Xóa order (nếu bạn cần dùng độc lập)
  const handleDeleteOrder = async (orderId) => {
    if (!confirm("Bạn chắc chắn muốn xóa order này vĩnh viễn?")) return;
    try {
      setLoading(true);
      await api.delete(`/orders/${orderId}`);
      await fetchOrders();
      alert("Đã xóa order.");
    } catch (err) {
      console.error(err);
      alert("Lỗi khi xóa order.");
    } finally {
      setLoading(false);
    }
  };

  // --- SUMMARY CALC ------------------------------------------------

  const counts = orders.reduce(
    (acc, o) => {
      const status = o.status || "";
      if (status === "đang chờ") acc.waiting++;
      else if (status === "đang vận chuyển") acc.shipping++;
      else if (status === "đã hủy") acc.cancelled++;
      return acc;
    },
    { waiting: 0, shipping: 0, cancelled: 0 }
  );

  const totalValue = orders
    .filter((o) => o.status === "đang chờ" || o.status === "đang vận chuyển")
    .reduce((sum, o) => sum + Number(o.totalPrice || 0), 0);

  // --- RENDER ------------------------------------------------------

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

        {orders.map((order) => {
          const orderId = order.id || order._id;
          return (
            <div
              key={orderId}
              className="border rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="flex justify-between items-center border-b pb-2 mb-3">
                <div className="flex items-center gap-2 text-gray-700">
                  <Package size={18} />
                  <span className="font-medium">Mã đơn: {String(orderId).slice(-6)}</span>
                </div>

                <div className="flex items-center gap-2">
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

                  {/* Buttons phụ thuộc status */}
                  {order.status === "đã hủy" && (
                    <button
                      onClick={() => handleReorder(order)}
                      className="ml-2 inline-flex items-center gap-2 px-3 py-1 rounded-md bg-green-600 text-white hover:bg-green-700 text-sm"
                    >
                      <Repeat size={16} /> Đặt lại
                    </button>
                  )}

                  {order.status === "đang vận chuyển" && (
                    <button
                      onClick={() => openChangeAddressModal(orderId)}
                      className="ml-2 inline-flex items-center gap-2 px-3 py-1 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 text-sm"
                    >
                      <MapPin size={16} /> Đổi địa chỉ
                    </button>
                  )}

                  {order.status === "đang chờ" && (
                    <button
                      onClick={() => handleCancelOrder(orderId)}
                      className="ml-2 inline-flex items-center gap-2 px-3 py-1 rounded-md bg-red-600 text-white hover:bg-red-700 text-sm"
                    >
                      <XCircle size={16} /> Hủy đơn
                    </button>
                  )}

                  {/* Xem ghi chú (mọi trạng thái) */}
                  <button
                    onClick={() => toggleNotes(orderId)}
                    className="ml-2 inline-flex items-center gap-2 px-3 py-1 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm"
                  >
                    <Eye size={16} /> Xem ghi chú
                  </button>
                </div>
              </div>

              {/* Danh sách sản phẩm */}
              <div className="flex flex-col gap-3">
                {order.products?.map((item, idx) => {
                  const prod = item.product || {};
                  const img = prod?.img?.[0] || prod?.img || "/placeholder.jpg";
                  return (
                    <div
                      key={idx}
                      className="flex items-center gap-4 border-b last:border-none pb-3"
                    >
                      <img
                        src={img}
                        alt={prod?.productName || "product"}
                        className="w-20 h-20 object-cover rounded-md"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-800">
                          {prod?.productName || prod?.name || "Sản phẩm"}
                        </h3>
                        <p className="text-gray-500 text-sm">
                          {item.quantity} x {new Intl.NumberFormat("vi-VN").format(item.price)}₫
                        </p>
                      </div>
                      <div className="font-semibold text-blue-600">
                        {new Intl.NumberFormat("vi-VN").format(
                          (item.quantity || 1) * (item.price || 0)
                        )}
                        ₫
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Thông tin phụ */}
              <div className="flex justify-between items-center mt-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar size={16} />{" "}
                  <span>
                    Ngày đặt:{" "}
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString("vi-VN")
                      : "-"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck size={16} />{" "}
                  <span>
                    Giao dự kiến:{" "}
                    {order.promisedDeliveryDate
                      ? new Date(order.promisedDeliveryDate).toLocaleDateString("vi-VN")
                      : "-"}
                  </span>
                </div>
              </div>

              {/* Tổng tiền */}
              <div className="text-right mt-3 font-semibold text-lg text-green-600">
                Tổng: {new Intl.NumberFormat("vi-VN").format(order.totalPrice || 0)}₫
              </div>

              {/* Ghi chú (mở rộng) */}
              {expandedOrders.has(orderId) && (
                <div className="mt-3 bg-gray-50 p-3 rounded-md text-sm text-gray-700">
                  <div className="font-medium mb-2">Ghi chú:</div>
                  {ensureNoteArray(order.note).length === 0 ? (
                    <div className="text-gray-500">Chưa có ghi chú.</div>
                  ) : (
                    <ul className="list-disc list-inside space-y-1">
                      {ensureNoteArray(order.note).map((n, i) => (
                        <li key={i}>{n}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Tổng kết đơn hàng (sticky) */}
      <div className="h-fit">
        <div className="bg-white border rounded-xl shadow-sm p-5 sticky top-20">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <ShoppingBag className="text-green-600" /> Tổng kết đơn hàng
          </h3>
          <div className="text-gray-600 space-y-2">
            <p>
              Đang chờ: <span className="font-medium text-gray-800">{counts.waiting}</span>
            </p>
            <p>
              Đang vận chuyển:{" "}
              <span className="font-medium text-gray-800">{counts.shipping}</span>
            </p>
            <p>
              Đã hủy: <span className="font-medium text-gray-800">{counts.cancelled}</span>
            </p>
            <p className="mt-2">
              Tổng giá trị (chờ + vận chuyển):{" "}
              <span className="font-semibold text-green-600">
                {new Intl.NumberFormat("vi-VN").format(totalValue)}₫
              </span>
            </p>
          </div>
          <button
            className="mt-5 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-all"
            onClick={() => {
              // tùy: chuyển đến trang checkout hoặc mở modal
              window.location.href = "/cart";
            }}
          >
            Tiếp tục mua sắm 
          </button>
        </div>
      </div>

      {/* Modal đổi địa chỉ */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={closeModal}
            aria-hidden
          />
          <div className="relative z-10 w-full max-w-md bg-white rounded-lg p-6 shadow-lg">
            <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <MapPin /> Đổi địa chỉ / Thêm ghi chú
            </h4>
            <textarea
              className="w-full border rounded-md p-2 min-h-[100px]"
              value={modalInput}
              onChange={(e) => setModalInput(e.target.value)}
              placeholder="Nhập địa chỉ mới hoặc ghi chú..."
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={closeModal}
                className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAddress}
                className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Order;
