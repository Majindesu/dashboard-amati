import { unauthorized } from "@/BaseError";
import prisma from "@/db";
import checkPermission from "@/features/auth/tools/checkPermission";
import "server-only";

/**
 * Retrieves all permissions along with the count of associated permissions and users.
 * Authorization check is performed for the operation.
 *
 * @returns An array of permission objects each including details and counts of related permissions and users.
 */
export default async function getPermissions() {
	// Authorization check
	if (!(await checkPermission("permissions.readAll"))) {
		return unauthorized();
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
		return permissions.map(
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
	} catch (error) {
		console.error("Error retrieving permissions", error);
		throw error;
	}
}
