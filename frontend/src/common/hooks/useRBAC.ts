import { useCallback } from "react";
import { useAuth } from "../../store/hooks";
import { Role, Permission, hasPermission, hasAnyPermission, hasAllPermissions, isAdmin, isUser } from "../rbac";

// Custom hook for checking permissions
export const usePermissions = () => {
  const { user } = useAuth();
  const userRole = user?.role as Role;

  const checkPermission = useCallback((permission: Permission): boolean => {
    if (!userRole) return false;
    return hasPermission(userRole, permission);
  }, [userRole]);

  const checkAnyPermission = useCallback((permissions: Permission[]): boolean => {
    if (!userRole) return false;
    return hasAnyPermission(userRole, permissions);
  }, [userRole]);

  const checkAllPermissions = useCallback((permissions: Permission[]): boolean => {
    if (!userRole) return false;
    return hasAllPermissions(userRole, permissions);
  }, [userRole]);

  const checkIsAdmin = useCallback((): boolean => {
    if (!userRole) return false;
    return isAdmin(userRole);
  }, [userRole]);

  const checkIsUser = useCallback((): boolean => {
    if (!userRole) return false;
    return isUser(userRole);
  }, [userRole]);

  return {
    userRole,
    checkPermission,
    checkAnyPermission,
    checkAllPermissions,
    checkIsAdmin,
    checkIsUser,
    // Convenience properties
    isAdmin: checkIsAdmin(),
    isUser: checkIsUser(),
  };
};

// Custom hook for specific permission checks
export const usePermission = (permission: Permission) => {
  const { checkPermission } = usePermissions();
  return checkPermission(permission);
};

// Custom hook for admin check
export const useIsAdmin = () => {
  const { checkIsAdmin } = usePermissions();
  return checkIsAdmin();
};

// Custom hook for user check
export const useIsUser = () => {
  const { checkIsUser } = usePermissions();
  return checkIsUser();
};
