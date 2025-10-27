// src/components/ProductPage/ProductDetailModal.jsx
import React, { useEffect, useRef, useState } from "react";
import {
  X,
  Heart,
  Share2,
  Facebook,
  Mail,
  Phone,
  Star,
  Minus,
  Plus,
  ShoppingCart,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

/**
 * ProductDetailModal
 * Props:
 *  - product: object
 *  - onClose: function
 *
 * Notes:
 *  - Requires Tailwind CSS in the project.
 *  - Uses lucide-react for icons.
 */

const resolveImageUrl = (url) => {
  if (!url) return "/placeholder.jpg";
  if (url.startsWith("http") || url.startsWith("data:image")) return url;
  const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
  return `${BASE_URL}/${url.replace(/^\/+/, "")}`;
};

const BadgeStatus = ({ quantity }) => {
  let text = "Còn hàng";
  let color = "bg-green-500";
  if (quantity <= 0) {
    text = "Hết hàng";
    color = "bg-red-500";
  } else if (quantity <= 5) {
    text = "Sắp hết";
    color = "bg-yellow-500";
  }
  return (
    <span className={`text-white text-xs font-semibold px-2 py-1 rounded-full ${color}`}>
      {text}
    </span>
  );
};

const RandomBadge = () => {
  const list = [
    { text: "Hot", color: "bg-red-500" },
    { text: "Best Seller", color: "bg-orange-500" },
    { text: "Chính Hãng", color: "bg-blue-600" },
  ];
  const pick = list[Math.floor(Math.random() * list.length)];
  return (
    <span className={`text-white text-xs font-semibold px-2 py-1 rounded ${pick.color}`}>
      {pick.text}
    </span>
  );
};

export default function ProductDetailModal({ product, onClose }) {
  const imgs =
    Array.isArray(product.img) && product.img.length
      ? product.img
      : [product.img || "/placeholder.jpg"];

  const [mainIndex, setMainIndex] = useState(0);
  const [thumbPage, setThumbPage] = useState(0);
  const THUMB_PAGE_SIZE = 4;
  const thumbPages = Math.max(1, Math.ceil(imgs.length / THUMB_PAGE_SIZE));

  // zoom & drag
  const [zoom, setZoom] = useState(1); // 1 or 3
  const imgWrapperRef = useRef(null);
  const imgRef = useRef(null);
  const dragging = useRef(false);
  const start = useRef({ x: 0, y: 0 });
  const translate = useRef({ x: 0, y: 0 });

  // qty & UI
  const [qty, setQty] = useState(product.quantity > 0 ? 1 : 0);
  const maxQty = Math.max(0, product.quantity ?? 0);

  // random rating and reviews on open
  const [rating, setRating] = useState(4.8);
  const [reviews, setReviews] = useState(356);

  useEffect(() => {
    // set random rating 4 or 5 with decimal and reviews between 200-2000
    const r = Math.random() < 0.5 ? (4 + Math.random() * 0.9) : (4.5 + Math.random() * 0.5);
    setRating(Math.round(r * 10) / 10);
    setReviews(200 + Math.floor(Math.random() * 1801));
    // reset zoom and translate when product changes
    setZoom(1);
    translate.current = { x: 0, y: 0 };
    if (imgRef.current) {
      imgRef.current.style.transform = `translate(0px,0px) scale(1)`;
    }
    setMainIndex(0);
    setThumbPage(0);
    setQty(product.quantity > 0 ? 1 : 0);
  }, [product]);

  // drag handlers (mouse)
  useEffect(() => {
    const onMove = (e) => {
      if (!dragging.current) return;
      e.preventDefault();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const dx = clientX - start.current.x;
      const dy = clientY - start.current.y;
      translate.current = { x: translate.current.x + dx, y: translate.current.y + dy };
      start.current = { x: clientX, y: clientY };
      applyTransform();
    };
    const onUp = () => {
      dragging.current = false;
      if (imgWrapperRef.current) imgWrapperRef.current.style.cursor = "grab";
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
    };
  }, []);

  const applyTransform = () => {
    if (!imgRef.current) return;
    imgRef.current.style.transform = `translate(${translate.current.x}px, ${translate.current.y}px) scale(${zoom})`;
  };

  const handleZoomToggle = (e) => {
    e.stopPropagation();
    if (zoom === 1) {
      setZoom(3);
      // keep translate
      if (imgWrapperRef.current) imgWrapperRef.current.style.cursor = "grab";
      translate.current = { x: 0, y: 0 };
      requestAnimationFrame(() => applyTransform());
    } else {
      setZoom(1);
      translate.current = { x: 0, y: 0 };
      if (imgRef.current) imgRef.current.style.transform = `translate(0px, 0px) scale(1)`;
      if (imgWrapperRef.current) imgWrapperRef.current.style.cursor = "default";
    }
  };

  const onMouseDown = (e) => {
    if (zoom === 1) return;
    dragging.current = true;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    start.current = { x: clientX, y: clientY };
    if (imgWrapperRef.current) imgWrapperRef.current.style.cursor = "grabbing";
  };

  // thumbnail pagination helpers
  const visibleThumbs = imgs.slice(thumbPage * THUMB_PAGE_SIZE, thumbPage * THUMB_PAGE_SIZE + THUMB_PAGE_SIZE);

  // share helper: copy current url then open fb sharer
  const handleShare = async () => {
    try {
      const url = window.location.href;
      await navigator.clipboard.writeText(url);
      const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
      window.open(fbUrl, "_blank");
    } catch (err) {
      console.warn("Share failed", err);
      const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
      window.open(fbUrl, "_blank");
    }
  };

  const handleCopyLinkOnly = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert("Đã copy link hiện tại vào clipboard");
    } catch {
      alert("Không thể copy link");
    }
  };

  // increase / decrease qty
  const dec = () => {
    setQty((p) => Math.max(0, p - 1));
  };
  const inc = () => {
    setQty((p) => Math.min(maxQty, p + 1));
  };

  // buy and add to cart handlers (placeholders)
  const handleBuyNow = () => {
    if (maxQty === 0) {
      // like action
      alert("Đã thích sản phẩm ❤️");
      return;
    }
    alert(`Mua ngay: ${qty} x ${product.productName}`);
    // Connect to cart/checkout logic here...
  };

  const handleAddToCart = () => {
    if (qty <= 0) {
      alert("Số lượng phải lớn hơn 0 để thêm giỏ hàng");
      return;
    }
    alert(`Thêm ${qty} sản phẩm vào giỏ`);
    // Connect to cart API/context...
  };

  // small helper for truncated description (3 lines) — uses Tailwind line-clamp if available
  const shortDesc = product.description
    ? product.description.split("\n").join(" ")
    : "Không có mô tả";

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center overflow-auto bg-black/50 p-6">
      <div className="bg-white rounded-xl max-w-6xl w-full shadow-2xl overflow-hidden">
        {/* Header / close */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div className="text-sm text-gray-600">
            <a href="/" className="hover:underline">Trang chủ</a>
            <span className="mx-2 text-gray-400">›</span>
            <a href="/product" className="hover:underline">Sản phẩm</a>
            <span className="mx-2 text-gray-400">›</span>
            <span className="text-gray-800">{product.productName}</span>
          </div>
          <button onClick={onClose} className="p-2 rounded hover:bg-gray-100">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: images */}
          <div className="space-y-3">
            <div className="relative bg-gray-50 rounded-lg overflow-hidden">
              {/* badge top-left */}
              <div className="absolute top-4 left-4 z-20">
                <BadgeStatus quantity={product.quantity ?? 0} />
              </div>

              {/* zoom button top-right */}
              <button
                onClick={handleZoomToggle}
                className="absolute top-4 right-4 z-20 bg-white rounded-full p-2 shadow-sm hover:shadow-md"
                title={zoom === 1 ? "Phóng to" : "Thu nhỏ"}
              >
                {zoom === 1 ? <ZoomIn size={18} /> : <ZoomOut size={18} />}
              </button>

              {/* main image area */}
              <div
                ref={imgWrapperRef}
                className="w-full h-[420px] md:h-[520px] flex items-center justify-center bg-white"
                onMouseDown={onMouseDown}
                onTouchStart={onMouseDown}
                onClick={(e) => {
                  // if not zoom, clicking anywhere in image area also opens zoom toggle
                  if (zoom === 1) {
                    // do nothing (we already show zoom button). Prevent accidental close.
                    e.stopPropagation();
                  }
                }}
                style={{ cursor: zoom === 1 ? "default" : "grab" }}
              >
                <img
                  ref={imgRef}
                  src={resolveImageUrl(imgs[mainIndex])}
                  alt={product.productName}
                  className="max-h-full max-w-full object-contain transition-transform duration-100"
                  style={{ transform: `translate(${translate.current.x}px, ${translate.current.y}px) scale(${zoom})` }}
                  onDragStart={(e) => e.preventDefault()}
                />
              </div>

              {/* thumbnails */}
              <div className="px-4 py-3 bg-white border-t flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setThumbPage((p) => Math.max(0, p - 1))}
                    disabled={thumbPage === 0}
                    className={`p-2 rounded border ${thumbPage === 0 ? "opacity-40 cursor-not-allowed" : "hover:bg-gray-100"}`}
                  >
                    ‹
                  </button>
                </div>

                <div className="flex gap-3 overflow-hidden">
                  {visibleThumbs.map((t, idx) => {
                    const realIdx = thumbPage * THUMB_PAGE_SIZE + idx;
                    return (
                      <button
                        key={realIdx}
                        onClick={() => {
                          setMainIndex(realIdx);
                          // reset zoom when change image
                          setZoom(1);
                          translate.current = { x: 0, y: 0 };
                        }}
                        className={`w-[72px] h-[56px] rounded border overflow-hidden ${realIdx === mainIndex ? "ring-2 ring-blue-500" : ""}`}
                      >
                        <img src={resolveImageUrl(t)} alt={`thumb-${realIdx}`} className="w-full h-full object-cover" />
                      </button>
                    );
                  })}
                </div>

                <div className="flex-1 flex justify-end">
                  <button
                    onClick={() => setThumbPage((p) => Math.min(thumbPages - 1, p + 1))}
                    disabled={thumbPage >= thumbPages - 1}
                    className={`p-2 rounded border ${thumbPage >= thumbPages - 1 ? "opacity-40 cursor-not-allowed" : "hover:bg-gray-100"}`}
                  >
                    ›
                  </button>
                </div>
              </div>

              {/* actions below thumbnails: favorite + share + socials */}
              <div className="px-4 py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => alert("Đã thêm vào yêu thích ❤️")}
                    className="flex items-center gap-2 text-gray-700 hover:text-red-500"
                  >
                    <Heart size={16} /> <span className="text-sm">Yêu thích</span>
                  </button>

                  <button
                    onClick={handleShare}
                    className="flex items-center gap-2 text-gray-700 hover:text-blue-600"
                    title="Sao chép link & chia sẻ Facebook"
                  >
                    <Share2 size={16} /> <span className="text-sm">Chia sẻ</span>
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <a href="https://fb.com/vuhung.boy" target="_blank" rel="noreferrer" className="p-2 rounded hover:bg-gray-100">
                    <Facebook size={18} />
                  </a>
                  <a href="mailto:vuhung.boy@gmail.com" className="p-2 rounded hover:bg-gray-100">
                    <Mail size={18} />
                  </a>
                  <a href="tel:0793656522" className="p-2 rounded hover:bg-gray-100">
                    <Phone size={18} />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right: details */}
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <h2 className="text-2xl font-semibold text-gray-800">{product.productName}</h2>
              <div className="flex items-center gap-2">
                <RandomBadge />
              </div>
            </div>

            {/* rating + stock */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={`${
                      i < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="ml-2 text-sm text-gray-600">{rating} ({reviews} đánh giá)</span>
              </div>
              <div className="ml-auto">
                <span className="text-sm text-green-600 font-medium">
                  <BadgeStatus quantity={product.quantity ?? 0} />
                </span>
              </div>
            </div>

            {/* price */}
            <div className="flex items-end gap-4">
              <div className="text-3xl text-red-600 font-bold">
                {new Intl.NumberFormat("vi-VN").format(product.price ?? 0)}₫
              </div>
              {product.originalPrice && (
                <div className="text-sm line-through text-gray-400">
                  {new Intl.NumberFormat("vi-VN").format(product.originalPrice)}₫
                </div>
              )}
            </div>

            {/* short description */}
            <p className="text-gray-600 text-sm line-clamp-3">{shortDesc}</p>

            {/* tags */}
            <div>
              <div className="text-sm text-gray-500 mb-2">Loại:</div>
              <div className="flex gap-2 flex-wrap">
                {(product.tags && product.tags.length) ? product.tags.map((t) => (
                  <span key={t._id || t.nameTag} className="px-3 py-1 rounded border text-sm text-gray-600">
                    {t.nameTag}
                  </span>
                )) : (
                  <span className="px-3 py-1 rounded border text-sm text-gray-400">Không có tag</span>
                )}
              </div>
            </div>

            {/* Thời Trang + sex */}
            <div className="text-sm text-gray-600">
              <strong>Thời Trang </strong> {product.sex ? ` ${product.sex}` : ""}
            </div>

            {/* Quantity selector */}
            <div className="flex items-center gap-4">
              <div>
                <div className="text-sm text-gray-600 mb-1">Số lượng:</div>
                <div className="inline-flex items-center border rounded-md overflow-hidden">
                  <button onClick={dec} className="p-2 hover:bg-gray-100">
                    <Minus size={16} />
                  </button>
                  <div className="px-4 py-2 min-w-[48px] text-center">{qty}</div>
                  <button onClick={inc} className="p-2 hover:bg-gray-100">
                    <Plus size={16} />
                  </button>
                </div>
                <div className="text-xs text-gray-400 mt-1">(Tối đa {maxQty} sản phẩm)</div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-2">
              <button
                onClick={handleBuyNow}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-white ${
                  maxQty === 0 ? "bg-red-500 hover:bg-red-600" : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {maxQty === 0 ? <Heart size={18} /> : <ShoppingCart size={18} />}
                <span className="font-medium">{maxQty === 0 ? "Yêu thích" : "Mua ngay"}</span>
              </button>

              <button
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-gray-200 hover:bg-gray-50"
              >
                <ShoppingCart size={18} />
                <span className="font-medium">Thêm vào giỏ hàng</span>
              </button>
            </div>

            {/* full description */}
            <div className="pt-4 border-t">
              <h3 className="text-lg font-medium mb-2">Mô tả sản phẩm</h3>
              <div className="text-sm text-gray-700 whitespace-pre-line">
                {product.longDescription || product.description || "Không có mô tả chi tiết."}
              </div>
            </div>
          </div>
        </div>

        {/* footer close */}
        <div className="p-4 border-t text-right">
          <button onClick={onClose} className="px-4 py-2 rounded hover:bg-gray-100">
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
