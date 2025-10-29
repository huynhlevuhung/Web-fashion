import React, { useEffect, useState } from "react";
import api from "@/utils/api";
import { Trash2, Plus, Minus, ShoppingCart, Loader2 } from "lucide-react";

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());

  // Modal
  const [modalVisible, setModalVisible] = useState(false);
  const [modalAction, setModalAction] = useState(null);
  const [processing, setProcessing] = useState(false);

  // Dữ liệu nhập trong modal
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [note, setNote] = useState("");

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
      setSelectedIds(new Set());
      setSelectMode(false);
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
      await fetchCart();
    } catch (err) {
      console.error("Lỗi khi cập nhật số lượng:", err);
    }
  };

  // 🗑 Xóa sản phẩm
  const removeItem = async (productId) => {
    try {
      await api.delete(`/carts/${user.id}/${productId}`);
      await fetchCart();
    } catch (err) {
      console.error("Lỗi khi xóa sản phẩm:", err);
    }
  };

  // 🧹 Xóa toàn bộ giỏ
  const clearCart = async () => {
    try {
      await api.delete(`/carts/${user.id}/clear/all`);
      await fetchCart();
    } catch (err) {
      console.error("Lỗi khi xóa toàn bộ giỏ hàng:", err);
    }
  };

  // Toggle chọn
  const toggleSelect = (productId) => {
    setSelectedIds((prev) => {
      const s = new Set(prev);
      s.has(productId) ? s.delete(productId) : s.add(productId);
      return s;
    });
  };

  const selectAll = () => {
    const all = new Set(cart.items.map((it) => it.product?._id));
    setSelectedIds(all);
  };
  const deselectAll = () => setSelectedIds(new Set());

  // 🧾 Tạo order
 const createOrderAndRemove = async ({ fromSelected = false }) => {
  if (!user?.id) return;
  if (processing) return; // tránh double click
  if (!deliveryAddress.trim()) {
    alert("Vui lòng nhập địa chỉ giao hàng!");
    return;
  }

  setProcessing(true);
  try {
    // 🔒 Lấy snapshot của cart và selectedIds tại thời điểm bấm
    const currentCart = cart || { items: [] };
    const currentSelected = new Set(selectedIds);

    const itemsToOrder = fromSelected
      ? currentCart.items.filter((it) => currentSelected.has(it.product?._id))
      : currentCart.items;

    if (!itemsToOrder.length) {
      alert("Không có sản phẩm nào được chọn!");
      setProcessing(false);
      return;
    }

    const orderPayload = {
      buyer: user.id,
      deliveryAddress,
      note: note ? [note] : [],
      products: itemsToOrder.map((it) => ({
        product: it.product?._id,
        quantity: it.quantity,
        price: it.product?.price,
      })),
      totalPrice: itemsToOrder.reduce(
        (sum, it) => sum + (it.product?.price || 0) * it.quantity,
        0
      ),
    };

    // 🧾 Tạo đơn hàng
    const res = await api.post("/orders", orderPayload);
    if (!res?.data) throw new Error("Không nhận được phản hồi từ server.");

    // 🗑 Xóa sản phẩm trong cart
    if (fromSelected) {
      const ids = itemsToOrder.map((it) => it.product?._id);
      await Promise.all(
        ids.map((pid) => api.delete(`/carts/${user.id}/${pid}`))
      );
    } else {
      await api.delete(`/carts/${user.id}/clear/all`);
    }

    // ✅ Thành công
    alert("Đặt hàng thành công!");
    setModalVisible(false);
    setDeliveryAddress("");
    setNote("");
    setSelectMode(false);
    setSelectedIds(new Set());
    await fetchCart();
  } catch (err) {
    console.error("❌ Lỗi khi tạo đơn hàng:", err);
    alert("Tạo đơn hàng thất bại! Vui lòng thử lại.");
  } finally {
    setProcessing(false);
    setModalAction(null);
  }
};


  // 🧮 Tổng kết
  const selectedItems =
    cart?.items?.filter((it) => selectedIds.has(it.product?._id)) || [];
  const selectedTotalPrice = selectedItems.reduce(
    (sum, it) => sum + (it.product?.price || 0) * it.quantity,
    0
  );
  const selectedCount = selectedItems.reduce((sum, it) => sum + it.quantity, 0);

  // UI
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
    <>
      <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {/* Danh sách sản phẩm */}
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <ShoppingCart className="w-6 h-6 text-blue-600" />
              Giỏ hàng của bạn
            </h2>

            <div className="flex items-center gap-3">
              <button
                onClick={() =>
                  setSelectMode((s) => {
                    const next = !s;
                    if (!next) setSelectedIds(new Set());
                    return next;
                  })
                }
                className="px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                {selectMode ? "Đóng chọn" : "Chọn"}
              </button>

              {selectMode && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={selectAll}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Chọn tất cả
                  </button>
                  <button
                    onClick={deselectAll}
                    className="px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                  >
                    Bỏ chọn
                  </button>
                  <button
                    onClick={() => {
                      setModalAction("delete-selected");
                      setModalVisible(true);
                    }}
                    className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    disabled={selectedIds.size === 0}
                  >
                    Xóa sản phẩm đã chọn
                  </button>
                </div>
              )}

              <button
                onClick={clearCart}
                className="flex items-center gap-2 text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-5 h-5" /> Xóa tất cả
              </button>
            </div>
          </div>

          {/* Các item */}
          <div className="bg-white shadow-md rounded-xl p-5 flex flex-col gap-5">
            {cart.items.map((item) => {
              const pid = item.product?._id;
              const isSelected = selectedIds.has(pid);
              return (
                <div
                  key={pid}
                  className="flex items-center justify-between border-b pb-4 last:border-none"
                >
                  <div className="flex items-center gap-4">
                    {selectMode && (
                      <input
                        type="checkbox"
                        className="w-5 h-5"
                        checked={isSelected}
                        onChange={() => toggleSelect(pid)}
                      />
                    )}
                    <img
                      src={item.product?.img?.[0] || "/placeholder.jpg"}
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
                    <div className="flex items-center border rounded-lg overflow-hidden">
                      <button
                        onClick={() =>
                          updateQuantity(pid, item.quantity - 1)
                        }
                        className="px-3 py-2 hover:bg-gray-100"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-4 py-2 border-x">{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(pid, item.quantity + 1)
                        }
                        className="px-3 py-2 hover:bg-gray-100"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="text-blue-600 font-semibold w-24 text-right">
                      {new Intl.NumberFormat("vi-VN").format(
                        item.quantity * item.product?.price
                      )}
                      ₫
                    </div>

                    <button
                      onClick={() => removeItem(pid)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tổng kết */}
        <div className="h-fit bg-white border rounded-xl shadow-sm p-5 sticky top-24 self-start">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <ShoppingCart className="text-green-600" />
            {selectMode ? "Tổng kết đơn hàng đã chọn" : "Tổng kết đơn hàng"}
          </h3>
          <div className="text-gray-600 space-y-2">
            <p>
              Tổng số sản phẩm:{" "}
              <span className="font-medium text-gray-800">
                {selectMode
                  ? selectedCount
                  : cart.items.reduce((s, it) => s + it.quantity, 0)}
              </span>
            </p>
            <p>
              Tổng giá trị:{" "}
              <span className="font-semibold text-green-600">
                {new Intl.NumberFormat("vi-VN").format(
                  selectMode ? selectedTotalPrice : cart.totalPrice
                )}
                ₫
              </span>
            </p>
          </div>

          <button
            onClick={() => {
              if (selectMode && selectedIds.size === 0) return;
              setModalAction(selectMode ? "checkout-selected" : "checkout-all");
              setModalVisible(true);
            }}
            className="mt-5 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-all"
          >
            Tiếp tục thanh toán →
          </button>
        </div>
      </div>

      {/* 🧾 Modal */}
      {modalVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md bg-white rounded-lg p-6 shadow-lg">
            {modalAction === "delete-selected" ? (
              <>
                <h4 className="text-xl font-semibold mb-4">Xác nhận xóa</h4>
                <p className="mb-6 text-gray-700">
                  Bạn có chắc muốn xóa{" "}
                  <b>{selectedIds.size}</b> sản phẩm đã chọn không?
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setModalVisible(false)}
                    className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={async () => {
                      setProcessing(true);
                      const ids = Array.from(selectedIds);
                      await Promise.all(
                        ids.map((pid) => api.delete(`/carts/${user.id}/${pid}`))
                      );
                      await fetchCart();
                      setModalVisible(false);
                      setSelectMode(false);
                      setSelectedIds(new Set());
                      setProcessing(false);
                    }}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    {processing ? "Đang xóa..." : "Xóa"}
                  </button>
                </div>
              </>
            ) : (
              <>
                <h4 className="text-xl font-semibold mb-4">
                  {modalAction === "checkout-selected"
                    ? "Xác nhận mua hàng đã chọn"
                    : "Xác nhận mua toàn bộ giỏ hàng"}
                </h4>

                <div className="space-y-3 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Địa chỉ giao hàng *
                    </label>
                    <input
                      type="text"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      placeholder="Nhập địa chỉ giao hàng..."
                      className="w-full border rounded-lg p-2 outline-none focus:ring"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Ghi chú (tuỳ chọn)
                    </label>
                    <textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      className="w-full border rounded-lg p-2 outline-none focus:ring resize-none"
                      rows="3"
                      placeholder="Thêm ghi chú cho đơn hàng..."
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setModalVisible(false)}
                    className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                    disabled={processing}
                  >
                    Hủy
                  </button>
                  <button
  onClick={() => {
    if (processing) return;
    createOrderAndRemove({
      fromSelected: modalAction === "checkout-selected",
    });
  }}
  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
  disabled={processing}
>
  {processing ? "Đang xử lý..." : "Xác nhận mua"}
</button>

                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Cart;
