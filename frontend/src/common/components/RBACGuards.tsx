import { ReactNode } from "react";
import { useAuth } from "../../store/hooks";
import { Role, Permission, hasPermission, hasAnyPermission, hasAllPermissions } from "../rbac";

// Props for RBAC components
interface PermissionGuardProps {
  permission: Permission;
  children: ReactNode;
  fallback?: ReactNode;
}

interface AnyPermissionGuardProps {
  permissions: Permission[];
  children: ReactNode;
  fallback?: ReactNode;
}

interface AllPermissionsGuardProps {
  permissions: Permission[];
  children: ReactNode;
  fallback?: ReactNode;
}

interface RoleGuardProps {
  role: Role;
  children: ReactNode;
  fallback?: ReactNode;
}

interface AdminOnlyProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface UserOnlyProps {
  children: ReactNode;
  fallback?: ReactNode;
}

// Single permission guard
export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  permission,
  children,
  fallback = null
}) => {
  const { user } = useAuth();

  if (!user || !hasPermission(user.role as Role, permission)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

// Any permission guard (requires at least one of the permissions)
export const AnyPermissionGuard: React.FC<AnyPermissionGuardProps> = ({
  permissions,
  children,
  fallback = null
}) => {
  const { user } = useAuth();

  if (!user || !hasAnyPermission(user.role as Role, permissions)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

// All permissions guard (requires all permissions)
export const AllPermissionsGuard: React.FC<AllPermissionsGuardProps> = ({
  permissions,
  children,
  fallback = null
}) => {
  const { user } = useAuth();

  if (!user || !hasAllPermissions(user.role as Role, permissions)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

// Role guard
export const RoleGuard: React.FC<RoleGuardProps> = ({
  role,
  children,
  fallback = null
}) => {
  const { user } = useAuth();

  if (!user || user.role !== role) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

// Admin only guard
export const AdminOnly: React.FC<AdminOnlyProps> = ({
  children,
  fallback = null
}) => {
  return (
    <RoleGuard role={Role.ADMIN} fallback={fallback}>
      {children}
    </RoleGuard>
  );
};

// User only guard
export const UserOnly: React.FC<UserOnlyProps> = ({
  children,
  fallback = null
}) => {
  return (
    <RoleGuard role={Role.USER} fallback={fallback}>
      {children}
    </RoleGuard>
  );
};
