import { rolePermissions } from "./rolePermissions";
import { type Permission } from "./permission";
import { type Role } from "./role";

export function hasPermission(
  role: Role,
  permission: Permission
): boolean {
  return rolePermissions[role].includes(permission);
}