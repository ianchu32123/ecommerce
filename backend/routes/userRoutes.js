import express from "express";
const router = express.Router();
import {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  getUsers,
  getUserByID,
  deleteUsers,
  updateUserProfile,
  updateUser,
} from "../controllers/userController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

router.route("/").get(protect, admin, getUsers).post(registerUser);
router.post("/logout", logoutUser);
router.post("/login", authUser);
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);
router
  .route("/:id")
  .delete(protect, admin, deleteUsers)
  .get(protect, admin, getUserByID)
  .put(protect, admin, updateUser);

export default router;
