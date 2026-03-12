import { Request, Response, NextFunction } from "express";
import { AppError } from "../errorHandler";
import { Role, Permission, ROLE_PERMISSIONS } from "../rbac";
import { AuthRequest } from "./auth.middleware";

// Extend AuthRequest to include user permissions
export interface AuthenticatedRequest extends AuthRequest {
  user?: {
    id: string;
    role: Role;
    permissions: Permission[];
  };
}

// Check if user has specific permission
export const hasPermission = (userRole: Role, permission: Permission): boolean => {
  const userPermissions = ROLE_PERMISSIONS[userRole];
  return userPermissions.includes(permission);
};

// Check if user has any of the specified permissions
export const hasAnyPermission = (userRole: Role, permissions: Permission[]): boolean => {
  return permissions.some(permission => hasPermission(userRole, permission));
};

// Check if user has all specified permissions
export const hasAllPermissions = (userRole: Role, permissions: Permission[]): boolean => {
  return permissions.every(permission => hasPermission(userRole, permission));
};

// Middleware to check if user has specific permission
export const requirePermission = (permission: Permission) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError("Authentication required", 401);
    }

    if (!hasPermission(req.user.role, permission)) {
      throw new AppError("Insufficient permissions", 403);
    }

    next();
  };
};

// Middleware to check if user has any of the specified permissions
export const requireAnyPermission = (permissions: Permission[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError("Authentication required", 401);
    }

    if (!hasAnyPermission(req.user.role, permissions)) {
      throw new AppError("Insufficient permissions", 403);
    }

    next();
  };
};

// Middleware to check if user has all specified permissions
export const requireAllPermissions = (permissions: Permission[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError("Authentication required", 401);
    }

    if (!hasAllPermissions(req.user.role, permissions)) {
      throw new AppError("Insufficient permissions", 403);
    }

    next();
  };
};

// Middleware to check if user has specific role
export const requireRole = (role: Role) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError("Authentication required", 401);
    }

    if (req.user.role !== role) {
      throw new AppError("Insufficient role privileges", 403);
    }

    next();
  };
};

// Middleware to check if user has any of the specified roles
export const requireAnyRole = (roles: Role[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError("Authentication required", 401);
    }

    if (!roles.includes(req.user.role)) {
      throw new AppError("Insufficient role privileges", 403);
    }

    next();
  };
};

// Middleware to add user permissions to request object
export const addUserPermissions = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (req.user) {
    req.user.permissions = ROLE_PERMISSIONS[req.user.role];
  }
  next();
};
