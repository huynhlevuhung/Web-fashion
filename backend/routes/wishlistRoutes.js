import express from "express";
import wishlistController from "../controllers/wishlistController.js";

const router = express.Router();

router.get("/", wishlistController.getAllWishlists);
router.get("/:userId", wishlistController.getWishlistByUser);

router.post("/add", wishlistController.addToWishlist);
router.delete("/remove", wishlistController.removeFromWishlist);
router.delete("/clear/:userId", wishlistController.clearWishlist);
router.get("/count/:userId", wishlistController.getTotalWishlistCount);

export default router;