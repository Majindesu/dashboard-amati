"use server";
import ServerResponseAction from "@/modules/dashboard/types/ServerResponseAction";
import handleCatch from "@/modules/dashboard/utils/handleCatch";
import unauthorized from "@/modules/dashboard/utils/unauthorized";
import Permission from "../types/Permission";
import getAllPermissions from "../services/getAllPermissions";
import checkPermission from "@/modules/auth/utils/checkPermission";

/**
 * Retrieves all permissions along with the count of associated permissions and users.
 * Authorization check is performed for the operation.
 *
 * @returns An array of permission objects each including details and counts of related permissions and users.
 */
export default async function getAllPermissionsAction(): Promise<
	ServerResponseAction<Permission[]>
> {
	// Authorization check
	if (!(await checkPermission("permissions.readAll"))) {
		unauthorized();
	}

	try {
		// Fetch permissions from the database
		const permissionsData = await getAllPermissions();

		return {
			success: true,
			data: permissionsData,
		};
	} catch (error) {
		return handleCatch(error);
	}
}
