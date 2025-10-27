// app.js
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

// Routers
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import productRouter from "./routes/productRoutes.js";
import promotionsRouter from "./routes/promotionRoutes.js";
import tagsRouter from "./routes/tagRoutes.js";
import cartsRouter from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
// Utils
import globalErrorHandle from "./controllers/errorController.js";
import AppError from "./utils/appError.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ------------------- Middleware -------------------

// CORS linh hoạt
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (origin.startsWith("http://localhost")) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Static folder for avatars/images
app.use(
  "/img/avatars",
  express.static(path.join(__dirname, "public/img/avatars"))
);
app.use(
  "/img/products",
  express.static(path.join(__dirname, "public/img/products"))
);

// ------------------- Routes -------------------

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/orders", orderRoutes);





app.use("/api/promotions", promotionsRouter);
app.use("/api/tags", tagsRouter);

// ------------------- 404 Not Found -------------------
app.use((req, res, next) => {
  next(new AppError(`Không tìm thấy ${req.originalUrl} trên server này!`, 404));
});

// ------------------- Global Error Handler -------------------
app.use(globalErrorHandle);

export default app;
