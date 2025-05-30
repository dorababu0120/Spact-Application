import express from "express";
import {
  getTasks,
  createTask,
  deleteTask,
} from "../controllers/personalTaskController.js";
import { protectRoute } from "../middleware/authMiddleware.js";

const router = express.Router();

// Routes
router
  .route("/")
  .get(protectRoute, getTasks)
  .post(protectRoute, createTask);

router
  .route("/:id")
  .delete(protectRoute, deleteTask);

export default router; // ✅ this line makes your import work
