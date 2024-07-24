import express from "express";
import { getSalesReport } from "../controllers/reportcontroller.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/sales", protect, admin, getSalesReport);

export default router;
