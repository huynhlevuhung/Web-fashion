// src/components/ProductList.jsx
import React, { useEffect, useState } from "react";
import api from "@/utils/api";
import { Heart, ShoppingCart, Eye } from "lucide-react";

const ProductList = ({ filters }) => {
  const [products, setProducts] = useState([]);
  const [curPage, setCurPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(16);
  const [loading, setLoading] = useState(true);

  // Responsive items per page
  useEffect(() => {
    const updateItemsPerPage = () => {
      if (window.innerWidth < 640) setItemsPerPage(4);
      else if (window.innerWidth < 1024) setItemsPerPage(9);
      else setItemsPerPage(16);
    };
    updateItemsPerPage();
    window.addEventListener("resize", updateItemsPerPage);
    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, []);

  // Fetch products with filters
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await api.get("/products/all", { params: filters });
        const data =
          res?.data?.data ??
          res?.data?.products ??
          (Array.isArray(res?.data) ? res.data : []);
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Lỗi khi lấy sản phẩm:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
    setCurPage(1);
  }, [filters]);

  const totalPages = Math.max(1, Math.ceil(products.length / itemsPerPage));
  const startIndex = (curPage - 1) * itemsPerPage;
  const currentProducts = products.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading)
    return (
      <div className="flex justify-center py-20 text-gray-500 text-lg">
        Đang tải sản phẩm...
      </div>
    );

  if (!loading && products.length === 0)
    return (
      <div className="flex justify-center py-20 text-gray-500 text-lg">
        Không tìm thấy sản phẩm nào.
      </div>
    );

  return (
    <div className="flex flex-col gap-6">
      {/* Danh sách sản phẩm */}
      <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
        {currentProducts.map((product) => (
          <ProductCard key={product._id ?? product.id} product={product} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-4 select-none">
          <button
            onClick={() => handlePageChange(curPage - 1)}
            disabled={curPage === 1}
            className={`px-3 py-1 rounded ${
              curPage === 1
                ? "text-gray-400 cursor-not-allowed"
                : "hover:bg-gray-200"
            }`}
          >
            « Trước
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              onClick={() => handlePageChange(num)}
              className={`px-3 py-1 rounded ${
                curPage === num
                  ? "bg-blue-600 text-white"
                  : "hover:bg-blue-100 text-gray-700"
              }`}
            >
              {num}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(curPage + 1)}
            disabled={curPage === totalPages}
            className={`px-3 py-1 rounded ${
              curPage === totalPages
                ? "text-gray-400 cursor-not-allowed"
                : "hover:bg-gray-200"
            }`}
          >
            Sau »
          </button>
        </div>
      )}
    </div>
  );
};

// Component hiển thị từng sản phẩm
const ProductCard = ({ product }) => {
  const resolveImageUrl = (url) => {
    if (!url) return "/placeholder.jpg";
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
    return `${BASE_URL}/${url.replace(/^\/+/, "")}`;
    
  };

  const [currentImg, setCurrentImg] = useState(
    resolveImageUrl(
      Array.isArray(product.img) && product.img.length > 0
        ? product.img[0]
        : product.img || "/placeholder.jpg"
    )
  );

  useEffect(() => {
    if (!product.img || !Array.isArray(product.img) || product.img.length <= 1) return;
    const interval = setInterval(() => {
      const randomImg = product.img[Math.floor(Math.random() * product.img.length)];
      setCurrentImg(resolveImageUrl(randomImg));
    }, 4000);
    return () => clearInterval(interval);
  }, [product.img]);

  // Badge tồn kho
  let stockBadge = { text: "Còn hàng", color: "bg-green-500" };
  if (product.quantity <= 0) stockBadge = { text: "Hết hàng", color: "bg-red-500" };
  else if (product.quantity <= 5) stockBadge = { text: "Sắp hết", color: "bg-yellow-500" };

  

  return (
    <div className="bg-white shadow-md rounded-xl overflow-hidden group relative hover:-translate-y-1 transition-all duration-300">
      <div className="relative w-full h-56 overflow-hidden">
        <img
          src={currentImg}
          alt={product.productName}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "/placeholder.jpg";
          }}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
        />

        {/* Overlay hover Eye */}
        <div className="absolute inset-0 pointer-events-none bg-black opacity-0 group-hover:opacity-50 flex items-center justify-center transition-opacity duration-300 ">
          <Eye
            size={32}
            className="text-white opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100 transition-all duration-300"
          />
        </div>

        {/* Badge tồn kho */}
        <span
          className={`absolute top-2 left-2 text-white text-xs font-semibold px-2 py-1 rounded-full ${stockBadge.color}`}
        >
          {stockBadge.text}
        </span>
      </div>

      {/* Nội dung sản phẩm */}
      <div className="p-3 flex flex-col gap-1">
        <h3 className="font-semibold text-gray-800 line-clamp-1">
          {product.productName}
        </h3>
        {/* Tag loại */}
        <div className="flex flex-wrap gap-1 mt-1">
          {product.tags?.length ? (
            product.tags.map((tag) => (
              <span
                key={tag._id || tag.nameTag}
                className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full"
              >
                {tag.nameTag}
              </span>
            ))
          ) : (
            <span className="text-gray-400 text-xs italic">Không có loại</span>
          )}
        </div>

        {/* Giá và icon */}
        <div className="flex items-center justify-between mt-3">
          <div className="text-blue-600 font-semibold text-base">
            {new Intl.NumberFormat("vi-VN").format(product.price)}₫
          </div>
          <div className="flex gap-2">
            <button className="p-2 rounded-full hover:bg-gray-100">
              <Heart size={18} className="text-gray-600" />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100">
              <ShoppingCart size={18} className="text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
