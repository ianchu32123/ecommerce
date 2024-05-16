import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/userModel.js";

//@desc 登入判斷
//@route Post /api/users/login
//@access Public
const authUser = asyncHandler(async (req, res) => {
  res.json("auth user");
});

//@desc 登入
//@route Post /api/users
//@access Public
const registerUser = asyncHandler(async (req, res) => {
  res.json("register user");
});

//@desc 登出/清除cookie
//@route Post /api/users/logout
//@access Private
const logoutUser = asyncHandler(async (req, res) => {
  res.json("logout user");
});

//@desc 使用者個人資訊
//@route Get/api/users/profile
//@access Private
const getUserProfile = asyncHandler(async (req, res) => {
  res.json("get user profile");
});

//@desc 更新使用者個人資訊
//@route Put /api/users/profile
//@access Private
const updateUserProfile = asyncHandler(async (req, res) => {
  res.json("update user profile");
});

//@desc 查看所有使用者
//@route GET /api/users
//@access Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  res.json("get users");
});

//@desc 查看單一
//@route GET /api/users/:id
//@access Private/Admin
const getUserByID = asyncHandler(async (req, res) => {
  res.json("get user by id");
});

//@desc 刪除使用者
//@route delete /api/users/:id
//@access Private/Admin
const deleteUsers = asyncHandler(async (req, res) => {
  res.json("delete user");
});

//@desc 更新使用者
//@route put /api/users/:id
//@access Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  res.json("update user");
});

export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  getUsers,
  getUserByID,
  deleteUsers,
  updateUserProfile,
  updateUser,
};
