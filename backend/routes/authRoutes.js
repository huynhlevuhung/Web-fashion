import express from "express";
import User from "../models/UserModel.js";
//import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// GET /me
router.get("/me", async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
