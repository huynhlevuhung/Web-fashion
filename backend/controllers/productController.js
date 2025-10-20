import ProductModel from "../models/ProductModel.js";
import "../models/StoreModel.js";
import "../models/TagModel.js";
import TagModel from "../models/TagModel.js";
import "../models/AreaModel.js";

const ITEMS_PER_PAGE = 9;
const productController = {
  // CREATE
  createProduct: async (req, res) => {
    try {
      const {
        productName,
        price,
        quantity,
        description,
        img,
        sex,
        remaining,
        status,
        tags,
      } = req.body;

      const newProduct = new ProductModel({
        productName,
        price,
        quantity,
        description,
        img,
        sex,
        remaining: remaining ?? quantity, // mặc định = số lượng nhập ban đầu
        status: status || "Đang bán",
        tags: tags && tags.length ? tags : [],
      });

      await newProduct.save();

      res.status(201).send({
        message: "Product created successfully",
        data: newProduct,
      });
    } catch (error) {
      res.status(500).send({ message: "Error", error: error.message });
    }
  },

  // READ - ALL
  
  // READ - ALL (với filter + phân trang chuẩn)
getAllProducts: async (req, res) => {
  try {
    const curPage = parseInt(req.query.curPage) || 1;
    const ITEMS_PER_PAGE = 9;

    const tagId = req.query.tagId;
    const name = req.query.name || "";

    // 🔍 1️⃣ Tạo object filter
    const filter = {};
    if (tagId) filter.tags = { $in: [tagId] };
    if (name) filter.productName = { $regex: name, $options: "i" };

    // 🧮 2️⃣ Đếm tổng số sản phẩm sau khi lọc
    const itemQuantity = await ProductModel.countDocuments(filter);
    const numberOfPages = Math.ceil(itemQuantity / ITEMS_PER_PAGE);

    // 🧠 Nếu trang vượt quá số trang thì báo lỗi
    let currentPage = curPage;
if (curPage > numberOfPages && numberOfPages > 0) {
  currentPage = 1; // ✅ reset về trang 1 nếu vượt quá tổng số trang
}


    // 📦 3️⃣ Lấy dữ liệu đã lọc + phân trang
    const data = await ProductModel.find(filter)
      .populate("tags")
      .skip((currentPage - 1) * ITEMS_PER_PAGE)

      .limit(ITEMS_PER_PAGE)
      .sort({ createdAt: -1 });

    // ✅ 4️⃣ Trả kết quả
    res.status(200).send({
      message: "Success",
      data,
      numberOfPages,
      curPage: currentPage, 
      totalItems: itemQuantity,
    });
  } catch (error) {
    res.status(500).send({ message: "Error", error: error.message });
  }
},


getAllProductsNoPaging: async (req, res) => {
  try {
    const data = await ProductModel.find().populate("tags");
    res.status(200).send({ message: "Success", data });
  } catch (error) {
    res.status(500).send({ message: "Error", error: error.message });
  }
},


  // READ - ONE
  getOneProduct: async (req, res) => {
    try {
      const { id } = req.params;
      const data = await ProductModel.findById(id)
        
        .populate("tags");
      if (!data) {
        return res.status(404).send({ message: "Product not found" });
      }
      res.status(200).send({ message: "Success", data });
    } catch (error) {
      res.status(500).send({ message: "Error", error: error.message });
    }
  },

  // READ - MOST FAVOURITE
  getMostFavouriteProducts: async (req, res) => {
    try {
      const data = await ProductModel.find()
        .sort({ traded_count: -1 })
        .limit(20)
        
        .populate("tags");

      res.status(200).send({ message: "Success", data });
    } catch (error) {
      res.status(500).send({ message: "Error", error: error.message });
    }
  },

  // READ - TOP RATING
  getTopRatingProducts: async (req, res) => {
    try {
      const products = await ProductModel.find()
        
        .populate("tags");

      const data = products
        .sort((a, b) => b.curRating - a.curRating)
        .slice(0, 20);

      res.status(200).send({ message: "Success", data });
    } catch (error) {
      res.status(500).send({ message: "Error", error: error.message });
    }
  },

  // READ - BY TAG
  getProductsByTag: async (req, res) => {
    try {
      const { tagId } = req.params;
      const curPage = parseInt(req.query.curPage) || 1;
      const itemQuantity = await ProductModel.countDocuments({ tags: tagId });
      const numberOfPages = Math.ceil(itemQuantity / 20);

      if (curPage > numberOfPages && numberOfPages > 0) {
        return res.status(400).send({ message: "Invalid page number" });
      }

      const tag = await TagModel.findById(tagId);

      const data = await ProductModel.find({ tags: tag })
        
        .populate("tags")
        .limit(20)
        .skip((curPage - 1) * 20);

      res.status(200).send({
        message: "Success",
        data,
        numberOfPages,
      });
    } catch (error) {
      res.status(500).send({
        message: "Error",
        error: error.message,
      });
    }
  },

  // READ - BY PRICE RANGE
  getProductsByPriceRange: async (req, res) => {
    try {
      const { min, max } = req.query;
      const curPage = parseInt(req.query.curPage) || 1;
      const itemQuantity = await ProductModel.countDocuments({
        price: { $gte: min || 0, $lte: max || Number.MAX_SAFE_INTEGER },
      });
      const numberOfPages = Math.ceil(itemQuantity / 20);
      const data = await ProductModel.find({
        price: { $gte: min || 0, $lte: max || Number.MAX_SAFE_INTEGER },
      })
        
        .populate("tags")
        .limit(20)
        .skip((curPage - 1) * 20);

      res.status(200).send({
        message: "Success",
        data,
        numberOfPages,
      });
    } catch (error) {
      res.status(500).send({
        message: "Error",
        error: error.message,
      });
    }
  },

  // READ - BY STORE
  getProductsByStore: async (req, res) => {
    try {
      const { storeId } = req.params;
      const curPage = parseInt(req.query.curPage) || 1;
      const itemQuantity = await ProductModel.countDocuments({ store: storeId });
      const numberOfPages = Math.ceil(itemQuantity / 20);
      const data = await ProductModel.find({ store: storeId })
        .populate("store")
        .populate("tags")
        .limit(20)
        .skip((curPage - 1) * 20);
      res.status(200).send({
        message: "Success",
        data,
        numberOfPages,
      });
    } catch (error) {
      res.status(500).send({
        message: "Error",
        error: error.message,
      });
    }
  },

  // UPDATE
 updateProduct: async (req, res) => {
  try {
    const { id } = req.params;

    // Chỉ cho phép update các field bạn muốn (ví dụ status)
    // Hoặc cứ để req.body như hiện tại cũng được
    const product = await ProductModel.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true, // chạy validate schema khi update
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product); // trả luôn product để frontend dùng
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
},

  // DELETE
  deleteProduct: async (req, res) => {
    try {
      const { id } = req.params;
      const product = await ProductModel.findByIdAndDelete(id);
      if (!product) {
        return res.status(404).send({ message: "Product not found" });
      }
      res.status(200).send({
        message: "Product deleted successfully",
      });
    } catch (error) {
      res.status(500).send({ message: "Error", error: error.message });
    }
  },
};

export default productController;