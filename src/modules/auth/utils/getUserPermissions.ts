import "server-only";
import getCurrentUser from "./getCurrentUser";
import db from "@/core/db";
import getUserRoles from "./getUserRoles";

export default async function getUserPermissions() {
	const user = await getCurrentUser();

	if (!user) return [];

    //Retrieve all permissions if the user is super admin
	if ((await getUserRoles()).includes("super-admin")) {
		return (await db.permission.findMany()).map((permission) => permission.code);
	}

	const permissions = new Set<string>([
		...user.roles.flatMap((role) =>
			role.permissions.map((permission) => permission.code)
		),
		...user.directPermissions.map((dp) => dp.code),
	]);

	return Array.from(permissions);
}
