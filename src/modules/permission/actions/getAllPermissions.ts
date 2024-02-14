"use server"
import prisma from "@/db";
import checkPermission from "@/modules/dashboard/services/checkPermission";
import ServerResponseAction from "@/modules/dashboard/types/ServerResponseAction";
import handleCatch from "@/modules/dashboard/utils/handleCatch";
import unauthorized from "@/modules/dashboard/utils/unauthorized";
import "server-only";
import Permission from "../types/Permission";

/**
 * Retrieves all permissions along with the count of associated permissions and users.
 * Authorization check is performed for the operation.
 *
 * @returns An array of permission objects each including details and counts of related permissions and users.
 */
export default async function getAllPermissions(): Promise<ServerResponseAction<Permission[]>> {
	// Authorization check
	if (!(await checkPermission("permissions.readAll"))) {
		unauthorized();
	}

	try {
		// Fetch permissions from the database
		const permissions = await prisma.permission.findMany({
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

        return {
            success: true,
            data: permissionsData
        }
	} catch (error) {
		return handleCatch(error)
	}
}
