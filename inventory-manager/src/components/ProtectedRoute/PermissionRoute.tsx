import { Navigate } from "react-router-dom";

import { getUser } from "../../auth/getUser";
import { hasPermission } from "../../auth/hasPermissions";
import { type Permission } from "../../auth/permission";

interface PermissionRouteProps {
  permission: Permission;
  children: React.ReactNode;
}

export default function PermissionRoute({
  permission,
  children,
}: PermissionRouteProps) {
  const user = getUser();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (!hasPermission(user.role, permission)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}