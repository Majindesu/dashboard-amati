import { unauthorized } from "@/BaseError";
import prisma from "@/db";
import checkPermission from "@/features/auth/tools/checkPermission";
import "server-only";

/**
 * Retrieves all roles along with the count of associated permissions and users.
 * Authorization check is performed for the operation.
 *
 * @returns An array of role objects each including details and counts of related permissions and users.
 */
export default async function getRoles() {
    // Authorization check
    if (!await checkPermission("roles.getAll")) {
        return unauthorized();
    }

    try {
        // Fetch roles from the database
        const roles = await prisma.role.findMany({
            include: {
                _count: {
                    select: {
                        permissions: true,
                        users: true
                    }
                }
            }
        });

        // Transform the data into the desired format
        return roles.map(({ id, code, name, description, isActive, _count }) => ({
            id,
            code,
            name,
            description,
            isActive,
            permissionCount: _count.permissions,
            userCount: _count.users
        }));
    } catch (error) {
        console.error('Error retrieving roles', error);
        throw error;
    }
}
