import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
//@desc 登入判斷
//@route Post /api/users/login
//@access Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.query;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });
    //設定cookie
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000, //30天
    });
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      //   token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("信箱不存在或密碼錯誤");
  }
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
