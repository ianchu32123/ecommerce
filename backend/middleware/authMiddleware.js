import jwt from "jsonwebtoken";
import asyncHandler from "./asyncHandler.js";
import User from "../models/userModel.js";

//保護路由
const protect = asyncHandler(async (req, res, next) => {
  let token;

  //讀取jwt
  token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userId).select("-password");

      next();
    } catch (error) {
      res.status(401);
      throw new Error("token failed");
    }
  } else {
    res.status(401);
    throw new Error("無授權 沒有token");
  }
});

//管理員中間件
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error("無管理員權限");
  }
};

export { protect, admin };
