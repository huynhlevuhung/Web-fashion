import { useState, useEffect } from "react";
import Navbar from "../components/HomePage/Navbar";
import Sidebar from "../components/ProductPage/Sidebar";
import ProductList from "../components/ProductPage/ProductList";
import SearchBar from "../components/ProductPage/SearchBar";
import api from "@/utils/api";

const ProductPage = () => {
  // 🧩 State quản lý sản phẩm & bộ lọc
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filters, setFilters] = useState({
    tag: null,
    sex: null,
    search: "",
    sort: "default",
  });

  const [loading, setLoading] = useState(false);

  // 📦 Lấy toàn bộ sản phẩm từ API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await api.get("/products/all");
        const allProducts = res.data?.products || [];
        setProducts(allProducts);
        setFilteredProducts(allProducts);
      } catch (err) {
        console.error("Lỗi khi lấy sản phẩm:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // 🧠 Lọc & sắp xếp sản phẩm mỗi khi filters thay đổi
  useEffect(() => {
    let data = [...products];

    // 1️⃣ Lọc theo tag
    if (filters.tag) {
  data = data.filter(
    (p) =>
      Array.isArray(p.tags) &&
      p.tags.some(
        (t) =>
          t === filters.tag || // trường hợp backend chưa populate
          t?._id === filters.tag || // nếu populate ra object
          t?.nameTag === filters.tag // nếu lọc theo tên tag
      )
  );
}


    // 2️⃣ Lọc theo giới tính
    if (filters.sex) {
      data = data.filter((p) => p.sex === filters.sex);
    }

    // 3️⃣ Tìm kiếm theo tên
    if (filters.search) {
      const keyword = filters.search.toLowerCase();
      data = data.filter((p) =>
        p.productName.toLowerCase().includes(keyword)
      );
    }

    // 4️⃣ Sắp xếp
    switch (filters.sort) {
      case "price-asc":
        data.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        data.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        data.sort((a, b) => a.productName.localeCompare(b.productName));
        break;
      case "name-desc":
        data.sort((a, b) => b.productName.localeCompare(a.productName));
        break;
      default:
        break;
    }

    setFilteredProducts(data);
  }, [filters, products]);

  // 🧾 Phân trang hiển thị
  const [curPage, setCurPage] = useState(1);
  const perPage = 16;
  const totalPages = Math.ceil(filteredProducts.length / perPage);
  const startIndex = (curPage - 1) * perPage;
  const visibleProducts = filteredProducts.slice(
    startIndex,
    startIndex + perPage
  );

  // 📊 Dữ liệu hiển thị trong thanh tìm kiếm
  const totalCount = filteredProducts.length;
  const visibleCount = visibleProducts.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-6">
        {/* Thanh tìm kiếm */}
        <SearchBar
          totalCount={totalCount}
          visibleCount={visibleCount}
          onSearch={(value) => {
            setCurPage(1);
            setFilters((f) => ({ ...f, search: value }));
          }}
          onSortChange={(value) => {
            setCurPage(1);
            setFilters((f) => ({ ...f, sort: value }));
          }}
          loading={loading}
        />

        <div className="flex gap-6 mt-6">
          {/* Sidebar */}
          <div className="w-1/4">
            <Sidebar setFilters={(newFilters) => {
              setCurPage(1);
              setFilters((f) => ({ ...f, ...newFilters }));
            }} />
          </div>

          {/* Danh sách sản phẩm */}
          <div className="flex-1">
            <ProductList
              products={visibleProducts}
              curPage={curPage}
              totalPages={totalPages}
              setCurPage={setCurPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
