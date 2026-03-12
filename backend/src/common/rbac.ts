import { z } from "zod";

// Role enum for type safety
export enum Role {
  USER = "user",
  ADMIN = "admin",
}

// Permission enum
export enum Permission {
  // User permissions
  READ_OWN_PROFILE = "read:own_profile",
  UPDATE_OWN_PROFILE = "update:own_profile",
  DELETE_OWN_PROFILE = "delete:own_profile",
  
  // Admin permissions
  READ_ALL_USERS = "read:all_users",
  UPDATE_ANY_USER = "update:any_user",
  DELETE_ANY_USER = "delete:any_user",
  MANAGE_ROLES = "manage:roles",
  
  // System permissions
  ACCESS_ADMIN_PANEL = "access:admin_panel",
  VIEW_SYSTEM_LOGS = "view:system_logs",
}

// Role permissions mapping
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  [Role.USER]: [
    Permission.READ_OWN_PROFILE,
    Permission.UPDATE_OWN_PROFILE,
    Permission.DELETE_OWN_PROFILE,
  ],
  [Role.ADMIN]: [
    Permission.READ_OWN_PROFILE,
    Permission.UPDATE_OWN_PROFILE,
    Permission.DELETE_OWN_PROFILE,
    Permission.READ_ALL_USERS,
    Permission.UPDATE_ANY_USER,
    Permission.DELETE_ANY_USER,
    Permission.MANAGE_ROLES,
    Permission.ACCESS_ADMIN_PANEL,
    Permission.VIEW_SYSTEM_LOGS,
  ],
};

// Zod schema for role validation
export const roleSchema = z.enum([Role.USER, Role.ADMIN]);

// Type exports
export type UserRole = z.infer<typeof roleSchema>;
