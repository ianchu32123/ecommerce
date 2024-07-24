import express from "express";
import path from "path";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import reportRoutes from "./routes/reportRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import faceRoutes from "./routes/faceRoutes.js";
import cookieParser from "cookie-parser";
const port = process.env.PORT || 5000;

connectDB(); //連線Mongo db

const app = express();

//body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//cookie parser

app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("API is running");
});

app.use("/api/products", productRoutes);

app.use("/api/users", userRoutes);

app.use("/api/orders", orderRoutes);

app.use("/api/upload", uploadRoutes);

app.use("/api/face", faceRoutes);

app.use("/api/reports", reportRoutes);

app.get("/api/config/paypal", (req, res) =>
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID })
);

const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Server running on port ${port}`));
