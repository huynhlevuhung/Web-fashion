import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  User,
  ShoppingCart,
  Search,
  LogOut,
  ChevronDown,
} from "lucide-react";
import Logo from "../../assets/Logo.jpg";

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const [showNav, setShowNav] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [hideTimeout, setHideTimeout] = useState(null); // ✅ timeout cho dropdown
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  const location = useLocation();
const isHome = location.pathname === "/";
  // ✅ Load user từ localStorage
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

  // ✅ Scroll để hiện navbar
  useEffect(() => {
    let timeout;
    const handleMouseMove = (e) => {
      if (e.clientY <= 80) setShowNav(true);
      else {
        clearTimeout(timeout);
        timeout = setTimeout(() => setShowNav(false), 1000);
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // ✅ Cập nhật giỏ hàng
  useEffect(() => {
    const updateCartCount = () => {
      if (user) {
        const cart = JSON.parse(localStorage.getItem(`cart_${user._id}`) || "[]");
        setCartCount(cart.length);
      } else {
        const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
        setCartCount(guestCart.length);
      }
    };
    updateCartCount();
    window.addEventListener("cartUpdated", updateCartCount);
    return () => window.removeEventListener("cartUpdated", updateCartCount);
  }, [user]);

  // ✅ Logout
 const handleLogout = () => {
  // 🔹 Xóa toàn bộ localStorage (token, user, giỏ hàng, v.v.)
  localStorage.clear();

  // 🔹 Nếu bạn có state toàn cục hoặc sự kiện cần reset UI
  window.dispatchEvent(new Event("userUpdated"));
  window.dispatchEvent(new Event("cartUpdated"));

  // 🔹 Reset state local
  setUser(null);
  setCartCount(0);

  // 🔹 Điều hướng về trang đăng nhập
  navigate("/login");
};


useEffect(() => {
  const handleScroll = () => {
    setIsScrolled(window.scrollY > 0);
  };
  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, []);

  // ✅ Cart click
  const handleCartClick = () => {
    if (!user) navigate("/login");
    else navigate("/cart");
  };

  // ✅ Dropdown hover (delay 1.5s)
  const handleMouseEnter = () => {
    if (hideTimeout) {
      clearTimeout(hideTimeout);
      setHideTimeout(null);
    }
    setShowDropdown(true);
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setShowDropdown(false);
    }, 1500);
    setHideTimeout(timeout);
  };

  // ✅ Avatar xử lý linh hoạt
  const getAvatarUrl = () => {
  if (user?.avatar && user.avatar !== "default.jpg") {
    return user.avatar.startsWith("http")
      ? user.avatar
      : `${import.meta.env.VITE_API_URL}/uploads/${user.avatar}`;
  }
  return "https://i.pravatar.cc/40";
};


  return (
  <nav
  className={`w-full z-50 transition-all duration-500 ${
    isHome
      ? "fixed top-0 bg-white shadow-md"
      : isScrolled
      ? "fixed top-0 bg-white/80 backdrop-blur-md shadow-md"
      : "relative bg-white shadow-sm"
  } ${showNav ? "translate-y-0" : "-translate-y-full"}`}
>


      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src={Logo} alt="Logo" className="w-28 h-auto object-contain" />
        </Link>

        {/* Menu Desktop */}
        <ul className="hidden sm:flex gap-6 text-gray-700 text-sm font-medium">
          {["/", "/collection", "/about", "/contact"].map((path, i) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `relative flex flex-col items-center transition-all duration-300 ${
                  isActive ? "text-black" : "hover:text-black text-gray-600"
                }`
              }
            >
              <p>{["HOME", "COLLECTION", "ABOUT", "CONTACT"][i]}</p>
              <span className="absolute bottom-[-3px] w-0 h-[2px] bg-black transition-all group-hover:w-1/2"></span>
            </NavLink>
          ))}
        </ul>

        {/* Right icons */}
        <div className="flex items-center gap-5">
          <Search className="w-5 h-5 cursor-pointer text-gray-700 hover:text-black" />

          {/* User */}
          <div
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {!user ? (
              <User
                className="w-6 h-6 cursor-pointer text-gray-700 hover:text-black"
                onClick={() => navigate("/login")}
              />
            ) : (
              <div className="flex items-center gap-2 cursor-pointer">
               <img
  src={user?.avatar || "https://i.pravatar.cc/40"}
  alt="avatar"
  className="w-10 h-10 rounded-full"
/>
                <span className="text-sm font-medium text-gray-700">
                  Xin chào, {user.fullname}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </div>
            )}

            {/* Dropdown */}
            {showDropdown && (
              <div className="absolute right-0 mt-3 w-40 bg-white border border-gray-100 rounded-lg shadow-md py-2 text-sm text-gray-600 z-50">
                {!user ? (
                  <>
                    <Link to="/login" className="block px-4 py-2 hover:bg-gray-50">
                      Đăng nhập
                    </Link>
                    <Link to="/signup" className="block px-4 py-2 hover:bg-gray-50">
                      Đăng ký
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/profile" className="block px-4 py-2 hover:bg-gray-50">
                      Hồ sơ
                    </Link>
                    <Link to="/cart" className="block px-4 py-2 hover:bg-gray-50">
                      Đơn hàng
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-50"
                    >
                      <LogOut className="w-4 h-4 text-gray-500" />
                      Đăng xuất
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Cart */}
          <div
            className="relative cursor-pointer"
            onClick={handleCartClick}
            title="Giỏ hàng"
          >
            <ShoppingCart className="w-6 h-6 text-gray-700 hover:text-black" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </div>

          {/* Menu Mobile */}
          <div className="sm:hidden">
            <button onClick={() => setVisible(true)}>
              <Menu className="w-6 h-6 text-gray-700" />
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar mobile */}
      <div
        className={`fixed top-0 right-0 h-full bg-white shadow-lg z-50 transition-all duration-500 ease-in-out ${
          visible ? "w-64" : "w-0 overflow-hidden"
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <p className="text-lg font-semibold">Menu</p>
          <X onClick={() => setVisible(false)} className="w-6 h-6 cursor-pointer" />
        </div>
        <div className="flex flex-col text-gray-600">
          {["/", "/collection", "/about", "/contact"].map((path, i) => (
            <NavLink
              key={path}
              onClick={() => setVisible(false)}
              to={path}
              className="py-3 px-6 border-b hover:bg-gray-50"
            >
              {["HOME", "COLLECTION", "ABOUT", "CONTACT"][i]}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
