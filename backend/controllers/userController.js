import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";
//@desc 登入判斷
//@route Post /api/users/login
//@access Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);

    res.status(200).json({
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
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("用戶已經存在");
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    generateToken(res, user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(400);
    throw new Error("Invaild user data");
  }
});

//@desc 登出/清除cookie
//@route Post /api/users/logout
//@access Private
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({
    message: "登出成功",
  });
});

//@desc 使用者個人資訊
//@route Get/api/users/profile
//@access Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("找不到該使用者");
  }
});

//@desc 更新使用者個人資訊
//@route Put /api/users/profile
//@access Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updateUser = await user.save();

    res.status(200).json({
      _id: updateUser._id,
      name: updateUser.name,
      email: updateUser.email,
      isAdmin: updateUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("找不到使用者");
  }
});

//@desc 查看所有使用者
//@route GET /api/users
//@access Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.status(200).json(users);
});

//@desc 查看單一
//@route GET /api/users/:id
//@access Private/Admin
const getUserByID = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404);
    throw new Error("找不到使用者");
  }
});

//@desc 刪除使用者
//@route delete /api/users/:id
//@access Private/Admin
const deleteUsers = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    if (user.isAdmin) {
      res.status(400);
      throw new Error("不能刪除管理員");
    }
    await User.deleteOne({ _id: user._id });
    res.status(200).json({ message: "刪除使用者成功" });
  } else {
    res.status(400);
    throw new Error("找不到該使用者");
  }
});

//@desc 更新使用者
//@route put /api/users/:id
//@access Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  console.log("Received request body:", req.body);
  const user = await User.findById(req.params.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.isAdmin = Boolean(req.body.isadmin);

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(400);
    throw new Error("找不到該使用者");
  }
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
