import "server-only";
import checkPermission from "@/modules/auth/utils/checkPermission";
import getCurrentUser from "@/modules/auth/utils/getCurrentUser";

/**
 * Checks multiple permissions for the current user and returns an object indicating
 * whether each permission is granted.
 * 
 * Deprecated. Moved into Auth module
 *
 * @deprecated
 * @param permissions - An object with keys as permission names and values as the required roles/permissions.
 * @returns An object with keys as permission names and boolean values indicating whether the permission is granted.
 */
async function checkMultiplePermissions<T extends Record<string, string>>(
	permissions: T
): Promise<{ [K in keyof T]: boolean }> {
	const permissionResults: Partial<{ [K in keyof T]: boolean }> = {};
	const currentUser = await getCurrentUser();

	for (const permissionKey in permissions) {
		if (permissions.hasOwnProperty(permissionKey)) {
			const requiredPermission = permissions[permissionKey];
			const isPermissionGranted = await checkPermission(
				requiredPermission,
				currentUser
			);
			permissionResults[permissionKey] = isPermissionGranted;
		}
	}

	return permissionResults as { [K in keyof T]: boolean };
}

export default checkMultiplePermissions;
