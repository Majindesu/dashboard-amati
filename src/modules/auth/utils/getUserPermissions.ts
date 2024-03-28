import "server-only";
import getCurrentUser from "./getCurrentUser";
import db from "@/core/db";
import getUserRoles from "./getUserRoles";
import { PermissionCode } from "@/modules/permission/data/initialPermissions";

export default async function getUserPermissions(): Promise<PermissionCode[]> {
	const user = await getCurrentUser();

	if (!user) return [];

	//Retrieve all permissions if the user is super admin
	if ((await getUserRoles()).includes("super-admin")) {
		return (await db.permission.findMany()).map(
			(permission) => permission.code
		) as PermissionCode[];
	}

	const permissions = new Set<PermissionCode>([
		...user.roles.flatMap((role) =>
			role.permissions.map((permission) => permission.code)
		),
		...user.directPermissions.map((dp) => dp.code),
	] as PermissionCode[]);

	return Array.from(permissions);
}
