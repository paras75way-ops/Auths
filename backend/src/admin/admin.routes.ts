import { Router } from "express";
import {
  getProfile,
  updateProfile,
  deleteProfile,
  getAllUsers,
  updateAnyUser,
  deleteAnyUser,
  accessAdminPanel,
  viewSystemLogs,
  manageUserRole,
} from "./admin.controller";
import { protect } from "../common/middleware/auth.middleware";
import { 
  requirePermission, 
  requireRole, 
  requireAnyPermission,
  Permission,
  Role,
  adminLimiter,
  generalLimiter
} from "../common";

const router = Router();

// User profile routes (any authenticated user)
router.get("/profile", generalLimiter, protect, requirePermission(Permission.READ_OWN_PROFILE), getProfile);
router.put("/profile", generalLimiter, protect, requirePermission(Permission.UPDATE_OWN_PROFILE), updateProfile);
router.delete("/profile", generalLimiter, protect, requirePermission(Permission.DELETE_OWN_PROFILE), deleteProfile);

// Admin-only routes with admin rate limiting
router.get(
  "/users", 
  adminLimiter, 
  protect, 
  requirePermission(Permission.READ_ALL_USERS), 
  getAllUsers
);

router.put(
  "/users/:userId", 
  adminLimiter, 
  protect, 
  requirePermission(Permission.UPDATE_ANY_USER), 
  updateAnyUser
);

router.delete(
  "/users/:userId", 
  adminLimiter, 
  protect, 
  requirePermission(Permission.DELETE_ANY_USER), 
  deleteAnyUser
);

router.get(
  "/admin/panel", 
  adminLimiter, 
  protect, 
  requirePermission(Permission.ACCESS_ADMIN_PANEL), 
  accessAdminPanel
);

router.get(
  "/admin/logs", 
  adminLimiter, 
  protect, 
  requirePermission(Permission.VIEW_SYSTEM_LOGS), 
  viewSystemLogs
);

router.put(
  "/admin/users/:userId/role", 
  adminLimiter, 
  protect, 
  requirePermission(Permission.MANAGE_ROLES), 
  manageUserRole
);

// Alternative: Using role-based middleware
router.get(
  "/admin/dashboard", 
  adminLimiter, 
  protect, 
  requireRole(Role.ADMIN), 
  (req, res) => res.json({ message: "Admin dashboard" })
);

// Alternative: Using multiple permissions
router.get(
  "/admin/reports", 
  adminLimiter, 
  protect, 
  requireAnyPermission([Permission.ACCESS_ADMIN_PANEL, Permission.VIEW_SYSTEM_LOGS]), 
  (req, res) => res.json({ message: "Admin reports" })
);

export default router;
