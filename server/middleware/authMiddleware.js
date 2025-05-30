import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

// Protect Route: Auth required for both user and admin
const protectRoute = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.token;

  if (token) {
    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decodedToken.userId).select("isAdmin email");

      if (!user) {
        return res.status(401).json({ status: false, message: "User not found" });
      }

      req.user = {
        email: user.email,
        isAdmin: user.isAdmin,
        userId: decodedToken.userId, // ✅ Required by your task controller
      };

      next();
    } catch (error) {
      console.error("Token verification failed:", error);
      return res
        .status(401)
        .json({ status: false, message: "Not authorized. Try login again." });
    }
  } else {
    return res
      .status(401)
      .json({ status: false, message: "Not authorized. Try login again." });
  }
});

// Admin check middleware
const isAdminRoute = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    return res.status(401).json({
      status: false,
      message: "Not authorized as admin. Try login as admin.",
    });
  }
};

// Alternate general protect middleware (not used in your tasks flow)
const protect = asyncHandler(async (req, res, next) => {
  let token = req.cookies?.token;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.userId).select("-password");

      if (!req.user) {
        return res.status(401).json({ status: false, message: "User not found" });
      }

      next();
    } catch (error) {
      res.status(401).json({ status: false, message: "Not authorized, token failed" });
    }
  } else {
    res.status(401).json({ status: false, message: "Not authorized, no token" });
  }
});

export default protect;

export { isAdminRoute, protectRoute };
