// src/components/DashboardPage/Product/Products.jsx
import { useEffect, useState, useMemo, useRef } from "react";
import api from "@/utils/api";
import { Eye, Trash } from "lucide-react";

import AddProductModal from "./AddProductModal";
import EditProductModal from "./EditProductModal";
import DeleteProductModal from "./DeleteProductModal";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [viewMode, setViewMode] = useState("grid");
  const [search, setSearch] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [deleteProduct, setDeleteProduct] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const itemsPerPage = 9;

  // carousel indexes per product
  const [imageIndexMap, setImageIndexMap] = useState({}); // { [productId]: idx }
  const productsRef = useRef([]);
  const mountedRef = useRef(true);

  // fetch products from BE (supports filters)
  const fetchProducts = async (page = 1, filters = {}) => {
    setLoading(true);
    try {
      const { search: s, tagFilter: tag, statusFilter: status } = filters;
      // build querystring similar to original style
      let q = `/products?curPage=${page}&limit=${itemsPerPage}`;
      if (s) q += `&search=${encodeURIComponent(s)}`;
      if (tag) q += `&tag=${encodeURIComponent(tag)}`;
      if (status) q += `&status=${encodeURIComponent(status)}`;

      const res = await api.get(q);

      // support both shapes: { data: [...] } or { products: [...] }
      const data = res.data?.data || res.data?.products || [];
      setProducts(data);
      productsRef.current = data;
      setTotalPages(res.data?.numberOfPages ?? res.data?.totalPages ?? 1);
      setCurrentPage(res.data?.curPage ?? page);

      // init image indexes for carousel
      const initIdx = {};
      data.forEach((p) => {
        initIdx[p._id] = 0;
      });
      setImageIndexMap(initIdx);
    } catch (err) {
      console.error("Fetch products failed:", err);
      setProducts([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  // fetch whenever page OR any filter changes
  useEffect(() => {
    mountedRef.current = true;
    fetchProducts(currentPage, { search, tagFilter, statusFilter });
    return () => {
      mountedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, search, tagFilter, statusFilter]);

  // carousel interval: advance imageIndexMap every 3s
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

  // filter logic kept minimal (since BE does server filtering)
  const filteredProducts = useMemo(() => {
    // Because now BE is expected to return already-filtered results,
    // keep a safety local filter (works on returned page only).
    let data = [...products];
    // NOTE: we already pass search/tag/status to BE; this local filter is optional
    if (search) {
      data = data.filter((p) =>
        (p.productName || "").toLowerCase().includes(search.toLowerCase())
      );
    }
    if (tagFilter) {
      data = data.filter((p) => p.tags?.some((t) => t.nameTag === tagFilter));
    }
    if (statusFilter) {
      data = data.filter((p) => {
        if (p.quantity <= 0) return statusFilter === "Hết hàng";
        if (p.quantity <= 5) return statusFilter === "Sắp hết";
        return statusFilter === "Còn hàng";
      });
    }
    return data;
  }, [products, search, tagFilter, statusFilter]);

  const currentItems = filteredProducts;

  // toggle selling status (keeps original file1 logic)
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

  // --- handlers: when user changes a filter we go back to page 1 (if not already),
  // so the BE will return page 1 of filtered results.
  const onSearchChange = (e) => {
    const v = e.target.value;
    setSearch(v);
     setCurrentPage(1);
  };
  const onTagChange = (e) => {
    const v = e.target.value;
    setTagFilter(v);
     setCurrentPage(1);
  };
  const onStatusChange = (e) => {
    const v = e.target.value;
    setStatusFilter(v);
    setCurrentPage(1);
  };

  return (
    <div className="p-4 space-y-4">
      {/* Toolbar */}
      <div className="bg-white p-5 rounded-lg shadow flex items-center gap-5">
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
        <button onClick={() => setViewMode(viewMode === "grid" ? "table" : "grid")} className="border rounded px-3 py-2">
          {viewMode === "grid" ? "Xem dạng bảng" : "Xem dạng lưới"}
        </button>
        <button onClick={() => setShowAddModal(true)} className="bg-blue-600 text-white rounded px-4 py-2">
          + Thêm sản phẩm
        </button>
      </div>

      {/* Grid View */}
      {viewMode === "grid" && (
        <div className="bg-white p-4 rounded-lg shadow grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            <div className="col-span-3 text-center py-6">Đang tải...</div>
          ) : (
            currentItems.map((p) => {
              const imgs = Array.isArray(p.img) ? p.img : [];
              const imgIdx = imageIndexMap[p._1d] ?? imageIndexMap[p._id] ?? 0; // fallback safety
              const qty = p.quantity ?? 0;

              let statusLabel = "";
              let statusColor = "";
              if (qty <= 0) {
                statusLabel = "Hết hàng";
                statusColor = "bg-red-500";
              } else if (qty <= 5) {
                statusLabel = "Sắp hết";
                statusColor = "bg-yellow-500";
              } else {
                statusLabel = "Còn hàng";
                statusColor = "bg-green-500";
              }

              return (
                <div key={p._id} className="relative group p-[2px] rounded-lg shadow-2xl overflow-visible">
                  {/* Border gradient */}
                  <div className="absolute inset-0 rounded-lg p-[2px] 
                    bg-[conic-gradient(from_0deg,skyblue_0deg,skyblue_40deg,white_60deg,skyblue_80deg,skyblue_360deg)] 
                    animate-border-spin"></div>

                  <div className="relative rounded-xl shadow-lg overflow-hidden 
                    transform transition-transform duration-500 group-hover:scale-115 
                    group-hover:z-50 group-hover:shadow-2xl">
                    <div className="absolute inset-0 rounded-xl 
                      bg-[conic-gradient(from_0deg,white_10deg,skyblue_80deg,skyblue_360deg)] 
                      animate-spin"></div>

                    <div className="relative bg-white rounded-xl p-4">
                      <span className={`absolute top-2 right-2 z-1 px-2 py-1 text-xs text-white rounded ${statusColor}`}>
  {statusLabel}
</span>

                      {/* image carousel */}
                      <div className="w-full h-40 overflow-hidden rounded">
                        <div className="relative w-full h-full">
                          {imgs.length ? (
                            imgs.map((url, idx) => {
                              const active = idx === (imageIndexMap[p._id] ?? 0);
                              return (
                                <img
                                  key={url + idx}
                                  src={url}
                                  alt={p.productName}
                                  className={`absolute inset-0 w-full h-full object-cover rounded transition-all duration-700 ease-in-out
                                    ${active ? "opacity-100 translate-x-0 z-0" : "opacity-0 translate-x-4 z-0"}`}
                                  style={{ transformOrigin: "center" }}
                                />
                              );
                            })
                          ) : (
                            <img src="https://via.placeholder.com/150" alt="placeholder" className="w-full h-full object-cover rounded" />
                          )}
                        </div>
                      </div>

                      <div className="mt-2 font-semibold">{p.productName}</div>
                      <div className="text-xs text-gray-500 italic">Thời Trang {p.sex || "Unisex"}</div>

                      <div className="text-sm text-gray-500">
                        {p.tags?.map((tag) => (
                          <span key={tag._id} className="inline-block mr-1 px-2 py-0.5 text-xs bg-gray-100 rounded">
                            {tag.nameTag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <div className="text-red-600 font-bold">
                          {new Intl.NumberFormat("vi-VN").format(p.price)} đ
                        </div>
                        <div className="text-sm text-gray-600">
                          Số lượng: {p.quantity}
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center">
                          <div
                            className={`relative inline-flex h-6 w-12 items-center rounded-full cursor-pointer transition-colors 
                              ${p.status === "Đang bán" ? "bg-green-500" : "bg-red-500"}`}
                            onClick={() =>
                              handleToggleSell(
                                p._id,
                                p.status === "Đang bán" ? "Ngưng bán" : "Đang bán"
                              )
                            }
                          >
                            <span
                              className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform 
                              ${p.status === "Đang bán" ? "translate-x-6" : "translate-x-1"}`}
                            />
                          </div>
                          <span className="text-sm ml-2">{p.status}</span>
                        </div>

                        <div className="flex gap-2 ml-auto">
                          <button onClick={() => setEditProduct(p)} className="text-blue-600">
                            <Eye size={18} />
                          </button>
                          <button onClick={() => setDeleteProduct(p)} className="text-red-600">
                            <Trash size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Table View */}
      {viewMode === "table" && (
        <div className="p-4 rounded-lg shadow flex items-center overflow-x-auto bg-white">
          <table className="min-w-full border">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2">Ảnh</th>
                <th className="p-2">Sản phẩm</th>
                <th className="p-2">Giá</th>
                <th className="p-2">Kho</th>
                <th className="p-2">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((p) => (
                <tr key={p._id} className="border-b">
                  <td className="p-2">
                    <div className="w-16 h-16 relative overflow-hidden rounded">
                      {Array.isArray(p.img) && p.img.length ? p.img.map((url, idx) => {
                        const active = idx === (imageIndexMap[p._id] ?? 0);
                        return (
                          <img
                            key={url + idx}
                            src={url}
                            alt={p.productName}
                            className={`absolute inset-0 w-full h-full object-cover rounded transition-all duration-700 ease-in-out
                              ${active ? "opacity-100 translate-x-0 z-10" : "opacity-0 translate-x-4 z-0"}`}
                          />
                        );
                      }) : (
                        <img src="https://via.placeholder.com/50" alt="placeholder" className="w-full h-full object-cover rounded"/>
                      )}
                    </div>
                  </td>
                  <td className="p-2">
                    <div className="font-semibold">{p.productName}</div>
                    <div className="text-sm text-gray-500">{p.tags?.[0]?.nameTag}</div>
                  </td>
                  <td className="p-2 text-red-600 font-bold">
                    {new Intl.NumberFormat("vi-VN").format(p.price)} VNĐ
                  </td>
                  <td className="p-2">
                    {p.quantity === 0 ? (
                      <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-700">
                        Hết hàng
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
                        Còn {p.quantity} sản phẩm
                      </span>
                    )}
                  </td>
                  <td className="p-2 flex gap-2 items-center">
                    <button onClick={() => setEditProduct(p)} className="text-blue-600">
                      <Eye size={18} />
                    </button>
                    <button onClick={() => setDeleteProduct(p)} className="text-red-600">
                      <Trash size={18} />
                    </button>
                  </td>
                </tr>
              ))}
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
        <AddProductModal open={true} onClose={() => setShowAddModal(false)} onSuccess={() => fetchProducts(currentPage, { search, tagFilter, statusFilter })} products={products} />
      )}
      {editProduct && (
        <EditProductModal product={editProduct} onClose={() => setEditProduct(null)} onSuccess={() => fetchProducts(currentPage, { search, tagFilter, statusFilter })} />
      )}
      {deleteProduct && (
        <DeleteProductModal product={deleteProduct} onClose={() => setDeleteProduct(null)} onSuccess={() => fetchProducts(currentPage, { search, tagFilter, statusFilter })} />
      )}

      <style>{`
        .translate-x-4 { transform: translateX(1rem); }
        .translate-x-0 { transform: translateX(0); }
      `}</style>
    </div>
  );
}
