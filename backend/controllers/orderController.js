// backend/controllers/orderController.js
import Order from "../models/OrderModel.js";
import User from "../models/UserModel.js";
import Product from "../models/ProductModel.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";

const orderController = {
  // 🧾 Tạo đơn hàng
  createOrder: async (req, res) => {
    try {
      const { buyer, deliveryAddress, products, note } = req.body;

      if (!buyer || !deliveryAddress || !products?.length) {
        return res.status(400).json({ message: "Thiếu thông tin đơn hàng." });
      }

      const totalPrice = products.reduce(
        (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
        0
      );

      const newOrder = await Order.create({
        buyer,
        deliveryAddress,
        products,
        totalPrice,
        note: Array.isArray(note) ? note : [],
        status: "đang chờ",
      });

      res.status(201).json({
        status: "success",
        data: newOrder,
      });
    } catch (error) {
      console.error("❌ Lỗi tạo đơn hàng:", error);
      res.status(500).json({ message: "Lỗi server khi tạo đơn hàng", error });
    }
  },

  // 📦 Lấy tất cả đơn hàng (lọc theo trạng thái, tìm theo tên khách hàng, lọc theo tháng)
 getAllOrders: catchAsync(async (req, res, next) => {
  const { status, search, month, page = 1, limit = 10 } = req.query;
  const filter = {};

  // Ẩn đơn đã hủy nếu không chọn cụ thể
  if (status && status !== "tất cả") filter.status = status;
  else filter.status = { $ne: "đã hủy" };

  // Lọc theo tháng (format YYYY-MM)
  if (month) {
    const [year, m] = month.split("-");
    const start = new Date(year, m - 1, 1);
    const end = new Date(year, m, 0, 23, 59, 59);
    filter.createdAt = { $gte: start, $lte: end };
  }

  // Lấy tất cả để xử lý search (vì search dựa vào tên người mua)
  let orders = await Order.find(filter)
    .populate("buyer", "fullname email phone")
    .populate("handler", "fullname email")
    .populate("products.product", "productName img price")
    .sort({ createdAt: -1 });

  // Tìm theo tên khách hàng
  if (search) {
    const regex = new RegExp(search, "i");
    orders = orders.filter((o) => regex.test(o.buyer?.fullname || ""));
  }

  // Tổng số kết quả sau khi lọc
  const total = orders.length;

  // Phân trang
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit);
  const paginatedOrders = orders.slice(startIndex, endIndex);

  res.status(200).json({
    status: "success",
    results: paginatedOrders.length,
    total, // tổng tất cả đơn sau khi lọc
    currentPage: parseInt(page),
    totalPages: Math.ceil(total / limit),
    data: paginatedOrders,
  });
}),


  // 👤 Lấy đơn hàng đang xử lý của người mua
  getActiveOrdersByBuyer: catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const activeStatuses = ["đang chờ", "đang vận chuyển", "đã hủy"];

    const orders = await Order.find({
      buyer: id,
      status: { $in: activeStatuses },
    })
      .populate("products.product", "productName img price")
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
      .populate("products.product", "productName img price")
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: "success",
      results: orders.length,
      data: orders,
    });
  }),



  // controllers/orderController.js
updateOrderStatusByAdmin: catchAsync(async (req, res, next) => {
  const session = await Order.startSession();
  session.startTransaction();

  try {
    const order = await Order.findById(req.params.id)
      .populate("products.product")
      .session(session);
    if (!order) throw new AppError("Không tìm thấy đơn hàng.", 404);

    const prevStatus = order.status;
    const { status, handlerId } = req.body;

    const adjustProducts = async (delta) => {
      for (const item of order.products) {
        const prod = await Product.findById(item.product._id).session(session);
        if (prod) {
          prod.quantity += item.quantity * delta;
          await prod.save({ session });
        }
      }
    };

    // Quy tắc thay đổi trạng thái
    if (prevStatus === "đang chờ" && status === "đang vận chuyển") {
      await adjustProducts(-1);
    } else if (prevStatus === "đang vận chuyển" && status === "đang chờ") {
      await adjustProducts(1);
    }

    order.status = status;

    // 🟢 Chỉ route dashboard mới cập nhật handler
    if (handlerId) order.handler = handlerId;

    await order.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ status: "success", data: order });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    next(err);
  }
}),

  // 🔄 Cập nhật trạng thái đơn hàng (tự động trừ/cộng stock, ghi handler)
  updateOrderStatus: catchAsync(async (req, res, next) => {
    const session = await Order.startSession();
    session.startTransaction();

    try {
      const order = await Order.findById(req.params.id)
        .populate("products.product")
        .session(session);
      if (!order) throw new AppError("Không tìm thấy đơn hàng.", 404);

      const prevStatus = order.status;
      const { status } = req.body;

      const adjustProducts = async (delta) => {
        for (const item of order.products) {
          const prod = await Product.findById(item.product._id).session(session);
          if (prod) {
            prod.quantity += item.quantity * delta;
            await prod.save({ session });
          }
        }
      };

      // Quy tắc thay đổi trạng thái
      if (prevStatus === "đang chờ" && status === "đang vận chuyển") {
        await adjustProducts(-1);
      } else if (prevStatus === "đang vận chuyển" && status === "đang chờ") {
        await adjustProducts(1);
      }

      order.status = status;
      order.handler = req.user?._id || order.handler;
      await order.save({ session });

      await session.commitTransaction();
      session.endSession();

      res.status(200).json({ status: "success", data: order });
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      next(err);
    }
  }),

  // ♻️ Hoàn tác đơn hàng 'đã nhận' → 'đang chờ' (triple-click + password)
  revertOrder: catchAsync(async (req, res, next) => {
    const { password } = req.body;
    if (password !== "0793656522")
      return res.status(401).json({ status: "fail", message: "Sai mật khẩu" });

    const session = await Order.startSession();
    session.startTransaction();
    try {
      const order = await Order.findById(req.params.id)
        .populate("products.product")
        .session(session);
      if (!order) throw new AppError("Không tìm thấy đơn hàng.", 404);
      if (order.status !== "đã nhận")
        throw new AppError("Chỉ có thể hoàn tác đơn 'đã nhận'.", 400);

      for (const item of order.products) {
        const prod = await Product.findById(item.product._id).session(session);
        if (prod) {
          prod.quantity += item.quantity;
          await prod.save({ session });
        }
      }

      order.status = "đang chờ";
      order.handler = req.user?._id || order.handler;
      await order.save({ session });

      await session.commitTransaction();
      session.endSession();
      res.status(200).json({ status: "success", data: order });
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      next(err);
    }
  }),

  // 🗒️ Thêm ghi chú
  addNote: catchAsync(async (req, res, next) => {
    const { note } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) throw new AppError("Không tìm thấy đơn hàng.", 404);
    order.note = order.note || [];
    order.note.push(note);
    await order.save();
    res.status(200).json({ status: "success", data: order });
  }),

  // 🧽 Xóa ghi chú theo index
  deleteNote: catchAsync(async (req, res, next) => {
    const idx = Number(req.params.index);
    const order = await Order.findById(req.params.id);
    if (!order) throw new AppError("Không tìm thấy đơn hàng.", 404);
    if (!Array.isArray(order.note)) order.note = [];
    order.note.splice(idx, 1);
    await order.save();
    res.status(200).json({ status: "success", data: order });
  }),

  // ❌ Xóa đơn hàng
  deleteOrder: catchAsync(async (req, res, next) => {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return next(new AppError("Không tìm thấy đơn hàng để xóa.", 404));
    res.status(204).json({ status: "success", data: null });
  }),
};

export default orderController;
