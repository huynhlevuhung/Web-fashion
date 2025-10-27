import CartModel from "../models/CartModel.js";
import ProductModel from "../models/ProductModel.js";

const calculateTotalPrice = (items) => {
  return items.reduce((sum, item) => {
    if (item.product?.price) {
      return sum + item.product.price * item.quantity;
    }
    return sum;
  }, 0);
};

const cartController = {
  // 📗 Lấy giỏ hàng của user theo id
  getCartByUser: async (req, res) => {
    try {
      const userId = req.params.id;

      const cart = await CartModel.findOne({ user: userId }).populate(
        "items.product",
        "productName price img"
      );

      if (!cart || cart.items.length === 0) {
        return res.status(200).json({
          message: "Cart is empty",
          cart: { items: [], totalPrice: 0 },
        });
      }

      const totalPrice = calculateTotalPrice(cart.items);
      res.status(200).json({
        message: "Fetched cart successfully",
        cart: { ...cart._doc, totalPrice },
      });
    } catch (error) {
      console.error("Error fetching cart:", error);
      res.status(500).json({ message: "Failed to fetch cart", error });
    }
  },

    getAllCarts: async (req, res) => {
    try {
      const carts = await CartModel.find().populate("user", "name email");
      res.status(200).json({ message: "Fetched all carts", carts });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch carts", error });
    }
  },

  // 📘 Admin: Đếm tổng số giỏ hàng
  getCartCount: async (req, res) => {
    try {
      const count = await CartModel.countDocuments();
      res.status(200).json({ message: "Cart count fetched", count });
    } catch (error) {
      res.status(500).json({ message: "Failed to count carts", error });
    }
  },

  // 🛒 Thêm sản phẩm
  addToCart: async (req, res) => {
    try {
      const userId = req.params.id;
      const { productId, quantity } = req.body;

      if (!productId || !quantity || quantity < 1)
        return res.status(400).json({ message: "Invalid product or quantity" });

      const product = await ProductModel.findById(productId);
      if (!product)
        return res.status(404).json({ message: "Product not found" });

      let cart = await CartModel.findOne({ user: userId }).populate(
        "items.product",
        "price"
      );

      if (!cart) {
        const newCart = new CartModel({
          user: userId,
          items: [{ product: productId, quantity }],
          totalPrice: product.price * quantity,
        });
        await newCart.save();
        return res
          .status(201)
          .json({ message: "Created new cart and added product", cart: newCart });
      }

      const existingItem = cart.items.find(
        (item) => item.product.id.toString() === productId
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity });
      }

      cart.totalPrice = calculateTotalPrice(cart.items);
      await cart.save();

      const updatedCart = await cart.populate(
        "items.product",
        "productName price img"
      );
      res.status(200).json({ message: "Product added to cart", cart: updatedCart });
    } catch (error) {
      res.status(500).json({ message: "Failed to add product to cart", error });
    }
  },

  // ✏️ Cập nhật số lượng sản phẩm
  updateItemQuantity: async (req, res) => {
    try {
      const userId = req.params.id;
      const { productId } = req.params;
      const { quantity } = req.body;

      if (!quantity || quantity < 1)
        return res
          .status(400)
          .json({ message: "Quantity must be greater than 0" });

      const cart = await CartModel.findOne({ user: userId }).populate(
        "items.product",
        "price"
      );
      if (!cart) return res.status(404).json({ message: "Cart not found" });

      const item = cart.items.find(
        (item) => item.product.id.toString() === productId
      );
      if (!item)
        return res.status(404).json({ message: "Product not found in cart" });

      item.quantity = quantity;
      cart.totalPrice = calculateTotalPrice(cart.items);
      await cart.save();

      const updatedCart = await cart.populate(
        "items.product",
        "productName price img"
      );
      res
        .status(200)
        .json({ message: "Cart updated successfully", cart: updatedCart });
    } catch (error) {
      res.status(500).json({ message: "Failed to update item quantity", error });
    }
  },

  // ❌ Xóa sản phẩm
  removeItem: async (req, res) => {
    try {
      const userId = req.params.id;
      const { productId } = req.params;

      const cart = await CartModel.findOne({ user: userId }).populate(
        "items.product",
        "price"
      );
      if (!cart) return res.status(404).json({ message: "Cart not found" });

      cart.items = cart.items.filter(
        (item) => item.product.id.toString() !== productId
      );
      cart.totalPrice = calculateTotalPrice(cart.items);
      await cart.save();

      const updatedCart = await cart.populate(
        "items.product",
        "productName price img"
      );
      res
        .status(200)
        .json({ message: "Item removed successfully", cart: updatedCart });
    } catch (error) {
      res.status(500).json({ message: "Failed to remove item", error });
    }
  },

  // 🧹 Xóa toàn bộ giỏ
  clearCart: async (req, res) => {
    try {
      const userId = req.params.id;
      await CartModel.findOneAndUpdate(
        { user: userId },
        { $set: { items: [], totalPrice: 0 } }
      );
      res.status(200).json({ message: "Cart cleared successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to clear cart", error });
    }
  },
};

export default cartController;
