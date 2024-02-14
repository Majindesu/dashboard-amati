"use server";
import prisma from "@/db";
import checkPermission from "@/modules/dashboard/services/checkPermission";
import ServerResponseAction from "@/modules/dashboard/types/ServerResponseAction";
import handleCatch from "@/modules/dashboard/utils/handleCatch";
import unauthorized from "@/modules/dashboard/utils/unauthorized";
import "server-only";
import Role from "../types/Role";

/**
 * Retrieves all roles along with the count of associated permissions and users.
 * Authorization check is performed for the operation.
 *
 * @returns An array of role objects each including details and counts of related permissions and users.
 */
export default async function getAllRoles(): Promise<
	ServerResponseAction<Role[]>
> {
	try {
		// Authorization check
		if (!(await checkPermission("roles.getAll"))) {
			unauthorized();
		}

		// Fetch roles from the database
		const roles = await prisma.role.findMany({
			include: {
				_count: {
					select: {
						permissions: true,
						users: true,
					},
				},
			},
		});

		// Transform the data into the desired format
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

        return {
            success: true,
            data: result
        }
	} catch (error) {
		return handleCatch(error)
	}
}
