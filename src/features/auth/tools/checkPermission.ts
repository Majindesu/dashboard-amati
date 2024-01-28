import getCurrentUser from "./getCurrentUser";
import "server-only";

/**
 * Checks if the current user has the specified permissions.
 *
 * @param permission - The specific permission to check. If it's "guest-only", the function returns true if the user is not authenticated. If it's "authenticated-only", it returns true if the user is authenticated. For other permissions, it checks against the user's roles and direct permissions.
 * @param currentUser - Optional. The current user object. If not provided, the function retrieves the current user.
 * @returns true if the user has the required permission, otherwise false.
 */
export default async function checkPermission(
	permission?: "guest-only" | "authenticated-only" | (string & {}),
	currentUser?: Awaited<ReturnType<typeof getCurrentUser>>
): Promise<boolean> {
	// Allow if no specific permission is required.
	if (!permission) return true;

	// Retrieve current user if not provided.
	const user = currentUser ?? (await getCurrentUser());

	// Handle non-authenticated users.
	if (!user) {
		return permission === "guest-only";
	}

	// Allow authenticated users if the permission is 'authenticated-only'.
	if (permission === "authenticated-only") {
		return true;
	}

	// Short-circuit for super-admin role to allow all permissions.
	if (user.roles.some((role) => role.code === "super-admin")) return true;

	// Aggregate all role codes and direct permissions into a set for efficient lookup.
	const permissions = new Set<string>([
		...user.roles.map((role) => role.code),
		...user.directPermissions.map((dp) => dp.code),
	]);

	// Check if the user has the required permission.
	return permissions.has(permission);
}
