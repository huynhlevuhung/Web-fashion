// src/components/DashboardPage/Product/Products.jsx
import { useEffect, useState, useRef } from "react";
import api from "@/utils/api";
import { Eye, Trash } from "lucide-react";

import AddProductModal from "./AddProductModal";
import EditProductModal from "./EditProductModal";
import DeleteProductModal from "./DeleteProductModal";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [viewMode, setViewMode] = useState("table"); // ✅ mặc định là table
  const [search, setSearch] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [deleteProduct, setDeleteProduct] = useState(null);

  const [imageIndexMap, setImageIndexMap] = useState({});
  const productsRef = useRef([]);
  const mountedRef = useRef(true);

  const ITEMS_PER_PAGE = 16;

  // 🧠 Fetch sản phẩm
  const fetchProducts = async (page = 1, filters = {}) => {
    setLoading(true);
    try {
      const { search: name, tagFilter: tagName, statusFilter: stockStatus } = filters;
      const params = new URLSearchParams();
      params.append("curPage", page);
      if (name) params.append("name", name);
      if (tagName) params.append("tagName", tagName);
      if (stockStatus) params.append("stockStatus", stockStatus);

      const res = await api.get(`/products?${params.toString()}`);
      const data = res.data?.data || [];

      setProducts(data);
      productsRef.current = data;
      setTotalPages(res.data?.numberOfPages ?? 1);
      setCurrentPage(res.data?.curPage ?? page);

      const initIdx = {};
      data.forEach((p) => (initIdx[p._id] = 0));
      setImageIndexMap(initIdx);
    } catch (err) {
      console.error("Fetch products failed:", err);
      setProducts([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    mountedRef.current = true;
    fetchProducts(currentPage, { search, tagFilter, statusFilter });
    return () => {
      mountedRef.current = false;
    };
  }, [currentPage, search, tagFilter, statusFilter]);

  // 🔁 Auto đổi ảnh
  useEffect(() => {
    const interval = setInterval(() => {
      if (!mountedRef.current) return;
      setImageIndexMap((prev) => {
        const next = { ...prev };
        productsRef.current.forEach((p) => {
          const imgs = Array.isArray(p.img) ? p.img : [];
          if (!imgs.length) return;
          next[p._id] = ((prev[p._id] ?? 0) + 1) % imgs.length;
        });
        return next;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Toggle trạng thái bán
  const handleToggleSell = async (id, newStatus) => {
    try {
      await api.put(`/products/${id}`, { status: newStatus });
      setProducts((prev) =>
        prev.map((item) => (item._id === id ? { ...item, status: newStatus } : item))
      );
    } catch (err) {
      console.error("Lỗi toggle:", err);
    }
  };

  // --- Filter handlers ---
  const onSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };
  const onTagChange = (e) => {
    setTagFilter(e.target.value);
    setCurrentPage(1);
  };
  const onStatusChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  // --- Render ---
  return (
    <div className="p-4 space-y-4">
      {/* Toolbar */}
      <div className="bg-white p-5 rounded-lg shadow flex items-center gap-5 flex-wrap">
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          value={search}
          onChange={onSearchChange}
          className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <select value={tagFilter} onChange={onTagChange} className="border rounded px-3 py-2">
          <option value="">Tất cả loại</option>
          {[...new Set(products.flatMap((p) => p.tags?.map((t) => t.nameTag)))].filter(Boolean).map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
        <select value={statusFilter} onChange={onStatusChange} className="border rounded px-3 py-2">
          <option value="">Tất cả trạng thái</option>
          <option value="Còn hàng">Còn hàng</option>
          <option value="Sắp hết">Sắp hết</option>
          <option value="Hết hàng">Hết hàng</option>
        </select>
        <button
          onClick={() => setViewMode(viewMode === "grid" ? "table" : "grid")}
          className="border rounded px-3 py-2"
        >
          {viewMode === "grid" ? "Xem dạng bảng" : "Xem dạng lưới"}
        </button>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white rounded px-4 py-2"
        >
          + Thêm sản phẩm
        </button>
      </div>

 {/* GRID VIEW */}
{viewMode === "grid" && (
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 bg-white p-4 rounded-lg shadow">
    {loading ? (
      <div className="col-span-full text-center py-6">Đang tải...</div>
    ) : products.length === 0 ? (
      <div className="col-span-full text-center text-gray-500 py-6">Không có sản phẩm</div>
    ) : (
      products.map((p) => {
        const imgs = Array.isArray(p.img) ? p.img : [];
        const imgIdx = imageIndexMap[p._id] ?? 0;
        const qty = p.quantity ?? 0;
        const statusLabel =
          qty <= 0 ? "Hết hàng" : qty <= 5 ? "Sắp hết" : "Còn hàng";
        const statusColor =
          qty <= 0 ? "bg-red-500" : qty <= 5 ? "bg-yellow-500" : "bg-green-500";

        return (
          <div
            key={p._id}
            className="group relative rounded-2xl border border-gray-100 shadow hover:shadow-xl hover:scale-105 transition-transform overflow-hidden"
          >
            {/* Image */}
            <div
              className="relative h-40 overflow-hidden cursor-pointer"
              onClick={() => setEditProduct(p)}
            >
              {imgs.length ? (
                imgs.map((url, idx) => {
                  const active = idx === imgIdx;
                  return (
                    <img
                      key={url + idx}
                      src={url}
                      alt={p.productName}
                      className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-in-out ${
                        active ? "opacity-100 scale-100" : "opacity-0 scale-110"
                      }`}
                    />
                  );
                })
              ) : (
                <img
                  src="https://via.placeholder.com/200"
                  alt="placeholder"
                  className="w-full h-full object-cover"
                />
              )}

              {/* Icon mắt mờ hiện hover */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-80 transition">
                <div className="bg-black bg-opacity-30 w-full h-full absolute"></div>
                <Eye
                  size={24}
                  className="relative text-white cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation(); // tránh trùng với onClick ảnh
                    setEditProduct(p);
                  }}
                />
              </div>

              {/* Trạng thái kho */}
              <span
                className={`absolute top-2 right-2 text-xs text-white px-2 py-1 rounded ${statusColor}`}
              >
                {statusLabel}
              </span>
            </div>

            {/* Info */}
            <div className="p-3">
              <h3 className="font-semibold text-gray-800 truncate group-hover:text-blue-600">
                {p.productName}
              </h3>
              <p className="text-xs text-gray-500 italic mb-1">
                Thời trang {p.sex || "Unisex"}
              </p>
              <div className="flex flex-wrap gap-1 mb-2">
                {p.tags?.map((tag) => (
                  <span
                    key={tag._id}
                    className="text-xs bg-gray-100 px-2 py-0.5 rounded-full"
                  >
                    {tag.nameTag}
                  </span>
                ))}
              </div>
              <div className="flex justify-between items-center">
                <span className="font-bold text-red-600">
                  {new Intl.NumberFormat("vi-VN").format(p.price)}đ
                </span>
                <span className="text-sm text-gray-500">SL: {p.quantity}</span>
              </div>

              {/* Toggle trạng thái bán */}
              <div className="flex items-center gap-2 mt-3">
                <div
                  className={`relative inline-flex h-6 w-12 items-center rounded-full cursor-pointer transition-colors ${
                    p.status === "Đang bán" ? "bg-green-500" : "bg-red-500"
                  }`}
                  onClick={() =>
                    handleToggleSell(
                      p._id,
                      p.status === "Đang bán" ? "Ngưng bán" : "Đang bán"
                    )
                  }
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                      p.status === "Đang bán" ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </div>
                <span className="text-sm">{p.status}</span>

                {/* Delete button hover */}
                <div className="ml-auto flex gap-2 opacity-0 group-hover:opacity-100 transition">
                  <button
                    onClick={() => setDeleteProduct(p)}
                    className="text-red-600"
                  >
                    <Trash size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })
    )}
  </div>
)}


      {/* TABLE VIEW */}
{viewMode === "table" && (
  <div className="bg-white p-4 rounded-lg shadow overflow-x-auto">
    <table className="min-w-full border-collapse border border-gray-200">
      <thead>
        <tr className="bg-gray-100 text-left border-b border-gray-300">
          <th className="p-2 w-[40%]">Sản phẩm</th>
          <th className="p-2 w-[20%]">Giá</th>
          <th className="p-2 w-[20%]">Kho</th>
          <th className="p-2 w-[20%]">Trạng thái</th>
        </tr>
      </thead>
      <tbody>
        {loading ? (
          <tr>
            <td colSpan={4} className="text-center py-4">Đang tải...</td>
          </tr>
        ) : products.length === 0 ? (
          <tr>
            <td colSpan={4} className="text-center py-4 text-gray-500">Không có sản phẩm</td>
          </tr>
        ) : (
          products.map((p) => {
            const qty = p.quantity ?? 0;
            const statusLabel = qty <= 0 ? "Hết hàng" : qty <= 5 ? "Sắp hết" : "Còn hàng";
            const statusColor = qty <= 0 ? "bg-red-100 text-red-700" : qty <= 5 ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700";

            return (
              <tr
  key={p._id}
  className="border-b border-gray-200 relative group hover:bg-gray-100 transition-colors duration-200"
>
  {/* Tên sản phẩm + ảnh */}
  <td className="p-2 flex items-center gap-2 max-w-[200px]">
    <img
      src={p.img?.[0] || "https://via.placeholder.com/50"}
      alt={p.productName}
      className="w-12 h-12 object-cover rounded flex-shrink-0"
    />
    <div className="flex-1 text-sm">
      <span className="hidden sm:inline">{p.productName}</span>
      <span className="inline sm:hidden truncate">{p.productName}</span>
    </div>
  </td>

  {/* Giá */}
  <td className="p-2 text-red-600 font-bold text-sm">{new Intl.NumberFormat("vi-VN").format(p.price)} đ</td>

  {/* Kho */}
  <td className="p-2 text-sm">
    <span className={`${statusColor} px-2 py-1 rounded`}>
      {window.innerWidth < 640 ? qty : qty <= 0 ? "Hết hàng" : `Còn ${qty} sản phẩm`}
    </span>
  </td>

  {/* Toggle trạng thái */}
  <td className="p-2">
    <div
      className={`relative inline-flex h-6 w-12 items-center rounded-full cursor-pointer transition-colors ${p.status === "Đang bán" ? "bg-green-500" : "bg-red-500"}`}
      onClick={() =>
        handleToggleSell(p._id, p.status === "Đang bán" ? "Ngưng bán" : "Đang bán")
      }
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${p.status === "Đang bán" ? "translate-x-6" : "translate-x-1"}`}
      />
    </div>
  </td>

  {/* Hover icons cuối dòng */}
  <td className="p-2 relative">
    <div className="absolute inset-0 flex justify-end items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
      <button
        onClick={() => setEditProduct(p)}
        className="text-blue-600 p-1 rounded"
      >
        <Eye size={20} />
      </button>
      <button
        onClick={() => setDeleteProduct(p)}
        className="text-red-600 p-1 rounded"
      >
        <Trash size={20} />
      </button>
    </div>
  </td>
</tr>

            );
          })
        )}
      </tbody>
    </table>
  </div>
)}





      {/* Pagination */}
      <div className="flex justify-center mt-4 gap-2">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 border rounded ${currentPage === i + 1 ? "bg-blue-600 text-white" : ""}`}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Modals */}
      {showAddModal && (
        <AddProductModal
          open={true}
          onClose={() => setShowAddModal(false)}
          onSuccess={() => fetchProducts(currentPage, { search, tagFilter, statusFilter })}
        />
      )}
      {editProduct && (
        <EditProductModal
          product={editProduct}
          onClose={() => setEditProduct(null)}
          onSuccess={() => fetchProducts(currentPage, { search, tagFilter, statusFilter })}
        />
      )}
      {deleteProduct && (
        <DeleteProductModal
          product={deleteProduct}
          onClose={() => setDeleteProduct(null)}
          onSuccess={() => fetchProducts(currentPage, { search, tagFilter, statusFilter })}
        />
      )}
    </div>
  );
}
