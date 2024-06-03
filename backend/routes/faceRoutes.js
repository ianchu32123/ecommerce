import express from "express";
import { upload, faceChecker } from "../controllers/faceController.js";

const router = express.Router();

router.post("/analyze", upload.single("image"), faceChecker);

export default router;
