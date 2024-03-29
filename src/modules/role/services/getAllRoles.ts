import db from "@/core/db";
import "server-only"
import Role from "../types/Role";

export default async function getAllRoles(): Promise<Role[]>{

    const roles = await db.role.findMany({
        include: {
            _count: {
                select: {
                    permissions: true,
                    users: true,
                },
            },
        },
    });

    //data transformation
	const result = roles.map(
		({ id, code, name, description, isActive, _count }) => ({
			id,
			code,
			name,
			description,
			isActive,
			permissionCount: _count.permissions,
			userCount: _count.users,
		})
	);

    return result;
}