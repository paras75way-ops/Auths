// RBAC Configuration - Mirrors backend RBAC
export const Role = {
  USER: "user",
  ADMIN: "admin",
} as const;

export type Role = typeof Role[keyof typeof Role];

export const Permission = {
  // User permissions
  READ_OWN_PROFILE: "read_own_profile",
  UPDATE_OWN_PROFILE: "update_own_profile",
  DELETE_OWN_PROFILE: "delete_own_profile",
  
  // Admin permissions
  READ_ALL_USERS: "read_all_users",
  UPDATE_ANY_USER: "update_any_user",
  DELETE_ANY_USER: "delete_any_user",
  MANAGE_ROLES: "manage_roles",
  ACCESS_ADMIN_PANEL: "access_admin_panel",
  VIEW_SYSTEM_LOGS: "view_system_logs",
} as const;

export type Permission = typeof Permission[keyof typeof Permission];

// Role-Permission mapping (mirrors backend)
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

// Helper functions for RBAC
export const hasPermission = (userRole: Role, permission: Permission): boolean => {
  return ROLE_PERMISSIONS[userRole]?.includes(permission) || false;
};

export const hasAnyPermission = (userRole: Role, permissions: Permission[]): boolean => {
  return permissions.some(permission => hasPermission(userRole, permission));
};

export const hasAllPermissions = (userRole: Role, permissions: Permission[]): boolean => {
  return permissions.every(permission => hasPermission(userRole, permission));
};

export const isAdmin = (userRole: Role): boolean => {
  return userRole === Role.ADMIN;
};

export const isUser = (userRole: Role): boolean => {
  return userRole === Role.USER;
};
