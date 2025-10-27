import React, { useEffect, useState } from "react";
import { ShoppingCart, Heart, Eye } from "lucide-react";
import api from "@/utils/api";
import { useNavigate } from "react-router-dom";
import ProductDetailModal from "@/components/ProductPage/ProductDetailModal";

// --- Định dạng giá tiền ---
const formatPrice = (price) =>
  price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " ₫";

// --- Hàm chọn ngẫu nhiên N phần tử trong mảng (chuẩn Fisher–Yates) ---
const getRandomProducts = (arr, count) => {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count);
};

const NewProducts = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  // tạm chưa có user login
  const userId = null;

  // ✅ Fetch tất cả sản phẩm và chọn ngẫu nhiên 12 cái
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/products/all"); // ⚙️ đảm bảo backend có endpoint /products/all
        const data = res.data.data || res.data;
        const random12 = getRandomProducts(data, 12);
        setProducts(random12);
      } catch (err) {
        console.error("Lỗi khi lấy sản phẩm:", err);
      }
    };
    fetchProducts();
  }, []);

  // --- Icon actions ---
  const handleAddToCart = (product) => {
    if (!userId) {
      console.log("Chưa đăng nhập — sẽ chuyển login sau");
      return;
    }
    console.log("Thêm vào giỏ hàng:", product._id);
  };

  const handleView = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleLike = (product) => {
    if (!userId) {
      navigate("/login");
      return;
    }
    navigate(`/wishlist/${userId}`);
  };

  // ✅ Khi click "Xem thêm" → chuyển sang trang ProductPage.jsx
  const handleViewMore = () => {
    navigate("/products"); // 👈 đảm bảo bạn có route này trong App.jsx
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Thanh tiêu đề */}
      <div className="flex justify-between items-center mb-8 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 uppercase tracking-wide">
          Sản phẩm mới
        </h2>
        <button
          onClick={handleViewMore}
          className="text-gray-600 hover:text-black text-sm font-medium transition"
        >
          Xem thêm
        </button>
      </div>

      {/* Lưới sản phẩm */}
      <div
        className="
          grid gap-6
          grid-cols-1
          sm:grid-cols-2
          md:grid-cols-3
          lg:grid-cols-4
          xl:grid-cols-6
          max-w-[1600px] mx-auto
        "
      >
        {products.map((product) => {
          const randomImg =
            product.img?.[Math.floor(Math.random() * product.img.length)] ||
            "/fallback.jpg";

          return (
            <div
              key={product._id}
              className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
            >
              {/* Hình ảnh */}
              <div
                className="relative aspect-[3/4] overflow-hidden cursor-pointer"
                onClick={() => handleView(product)}
              >
                <img
                  src={randomImg}
                  alt={product.productName}
                  className="w-full h-full object-cover transition-all duration-500 group-hover:brightness-[30%]"
                />

                {/* Icon hover */}
                <div className="absolute inset-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(product);
                    }}
                    className="p-2 bg-white/40 backdrop-blur-sm rounded-full shadow hover:bg-white/60 transition"
                    title="Thêm vào giỏ"
                  >
                    <ShoppingCart className="w-5 h-5 text-white" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleView(product);
                    }}
                    className="p-2 bg-white/40 backdrop-blur-sm rounded-full shadow hover:bg-white/60 transition"
                    title="Xem sản phẩm"
                  >
                    <Eye className="w-5 h-5 text-white" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLike(product);
                    }}
                    className="p-2 bg-white/40 backdrop-blur-sm rounded-full shadow hover:bg-white/60 transition"
                    title="Yêu thích"
                  >
                    <Heart className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>

              {/* Tên và giá */}
              <div className="p-3">
                <h3 className="text-sm text-gray-800 line-clamp-2 leading-snug">
                  {product.productName}
                </h3>
                <p className="text-black-600 font-semibold text-base mt-1 text-right">
                  {formatPrice(product.price)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal chi tiết sản phẩm */}
      {isModalOpen && selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default NewProducts;
