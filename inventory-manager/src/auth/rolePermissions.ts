import { Permission, type Permission as PermissionType } from "./permission";
import { Role, type Role as RoleType } from "./role";

const userPermissions: PermissionType[] = [
];


export const rolePermissions: Record<RoleType, PermissionType[]> = {
  [Role.USER]: userPermissions,

  [Role.ADMIN]: Object.values(Permission),
};
