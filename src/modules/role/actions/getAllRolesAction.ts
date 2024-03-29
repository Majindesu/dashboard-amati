"use server";
import ServerResponseAction from "@/modules/dashboard/types/ServerResponseAction";
import handleCatch from "@/modules/dashboard/utils/handleCatch";
import unauthorized from "@/modules/dashboard/utils/unauthorized";
import Role from "../types/Role";
import checkPermission from "@/modules/auth/utils/checkPermission";
import getAllRoles from "../services/getAllRoles";

/**
 * Retrieves all roles along with the count of associated permissions and users.
 * Authorization check is performed for the operation.
 *
 * @returns An array of role objects each including details and counts of related permissions and users.
 */
export default async function getAllRolesAction(): Promise<
	ServerResponseAction<Role[]>
> {
	try {
		// Authorization check
		if (!(await checkPermission("roles.readAll"))) {
			return unauthorized();
		}

		// Fetch roles from the database
		const roles = await getAllRoles()

        return {
            success: true,
            data: roles
        }
	} catch (error) {
		return handleCatch(error)
	}
}
