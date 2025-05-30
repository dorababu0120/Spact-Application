import express from "express";
import {
  createSubTask,
  createTask,
  dashboardStatistics,
  deleteRestoreTask,
  duplicateTask,
  getTask,
  getTasks,
  postTaskActivity,
  trashTask,
  updateTask,
  updateTaskStage,
  leaveTask,
} from "../controllers/taskController.js";

import { isAdminRoute, protectRoute } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ CREATE ROUTES
router.post("/create", protectRoute, isAdminRoute, createTask);
router.post("/duplicate/:id", protectRoute, isAdminRoute, duplicateTask);
router.post("/activity/:id", protectRoute, postTaskActivity);

// ✅ DASHBOARD / GENERAL GET ROUTES
router.get("/dashboard", protectRoute, dashboardStatistics);
router.get("/", protectRoute, getTasks);

// ✅ USER LEAVES TASK — put this BEFORE /:id
router.put("/leave/:id", protectRoute, leaveTask);

// ✅ GET SINGLE TASK — must be after /leave/:id
router.get("/:id", protectRoute, getTask);

// ✅ UPDATE ROUTES
router.put("/create-subtask/:id", protectRoute, isAdminRoute, createSubTask);
router.put("/update/:id", protectRoute, isAdminRoute, updateTask);
router.put("/change-stage/:id", protectRoute, updateTaskStage);
router.put("/:id", protectRoute, isAdminRoute, trashTask);



// ✅ DELETE / RESTORE ROUTE
router.delete(
  "/delete-restore/:id?",
  protectRoute,
  isAdminRoute,
  deleteRestoreTask
);

export default router;
