import db from "@/core/db";
import "server-only";
import Permission from "../types/Permission";

export default async function getAllPermissions(): Promise<Permission[]> {
	const permissions = await db.permission.findMany({
		include: {
			_count: {
				select: {
					roles: true,
					directUsers: true,
				},
			},
		},
	});

	// Transform the data into the desired format
	const permissionsData = permissions.map(
		({ id, code, name, description, isActive, _count }) => ({
			id,
			code,
			name,
			description,
			isActive,
			roleCount: _count.roles,
			//User count counts only direct user
			userCount: _count.directUsers,
		})
	);

	return permissionsData;
}
