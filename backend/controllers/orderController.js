// backend/controllers/orderController.js
import Order from "../models/OrderModel.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";

const orderController = {
  // 🧾 Tạo đơn hàng
  createOrder: catchAsync(async (req, res, next) => {
  const { buyer, deliveryAddress, products, note } = req.body;

  if (!buyer || !deliveryAddress || !products || products.length === 0) {
    return next(new AppError("Thiếu thông tin đơn hàng.", 400));
  }

  // Tính tổng giá trị đơn hàng
  const totalPrice = products.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
    0
  );

  // Tạo đơn hàng mới
  const newOrder = await Order.create({
    buyer,
    deliveryAddress,
    products,
    totalPrice,
    note: note || "",
    status: "đang chờ", // ✅ mặc định
  });

  res.status(201).json({
    status: "success",
    data: newOrder,
  });
}),


  // 📦 Lấy tất cả đơn hàng
  getAllOrders: catchAsync(async (req, res, next) => {
    const orders = await Order.find()
      .populate("buyer", "name email")
      .populate("user", "username email fullname")
      .populate("products.product", "productName img")

    res.status(200).json({
      status: "success",
      results: orders.length,
      data: orders,
    });
  }),

  // 👤 Lấy đơn hàng theo người mua
 // 👤 Lấy đơn hàng đang xử lý của người mua
getActiveOrdersByBuyer: catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const activeStatuses = ["đang chờ", "đang vận chuyển", "đã hủy"];

  const orders = await Order.find({
    buyer: id,
    status: { $in: activeStatuses },
  })
    .populate("products.product", "productName img")
    .sort({ createdAt: -1 });

  res.status(200).json({
    status: "success",
    results: orders.length,
    data: orders,
  });
}),

// ✅ Lấy đơn hàng đã nhận (hoàn thành)
getCompletedOrdersByBuyer: catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const orders = await Order.find({
    buyer: id,
    status: "đã nhận",
  })
    .populate("products.product", "name")
    .sort({ createdAt: -1 });

  res.status(200).json({
    status: "success",
    results: orders.length,
    data: orders,
  });
}),

  // 🔄 Cập nhật trạng thái đơn hàng
updateOrder: catchAsync(async (req, res, next) => {
  const oldOrder = await Order.findById(req.params.id).populate("products.product");
  if (!oldOrder) return next(new AppError("Không tìm thấy đơn hàng.", 404));

  // 🧩 Nếu trạng thái cũ là "đang chờ" và trạng thái mới là "đã hủy"
  if (oldOrder.status === "đang chờ" && req.body.status === "đã hủy") {
    for (const item of oldOrder.products) {
      const product = item.product;
      if (product) {
        product.quantity += item.quantity;
        await product.save();
      }
    }
  }

  const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: order,
  });
}),
  

  // ❌ Xóa đơn hàng
  deleteOrder: catchAsync(async (req, res, next) => {
    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) return next(new AppError("Không tìm thấy đơn hàng để xóa.", 404));

    res.status(204).json({
      status: "success",
      data: null,
    });
  }),
};

export default orderController;
