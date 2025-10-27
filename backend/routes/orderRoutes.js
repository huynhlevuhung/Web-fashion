// backend/routes/orderRoutes.js
import express from "express";
import orderController from "../controllers/orderController.js";

const router = express.Router();

router
  .route("/")
  .get(orderController.getAllOrders)
  .post(orderController.createOrder);

router
  .route("/:id")
  .put(orderController.updateOrder)
  .delete(orderController.deleteOrder);

router.get("/active/:id", orderController.getActiveOrdersByBuyer);
router.get("/complete/:id", orderController.getCompletedOrdersByBuyer);

export default router;
