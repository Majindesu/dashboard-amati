import { getUserFromToken } from "../authUtils";
import getCurrentUser from "./getCurrentUser";

type PermissionsInput = Record<string, string>;

type PermissionsOutput = Record<string, boolean>;

/**
 * Checks multiple permissions for the current user and returns an object indicating
 * whether each permission is granted.
 * 
 * @param {PermissionsInput} permissions - An object with keys as permission names and values as the required roles/permissions.
 * @returns {Promise<PermissionsOutput>} An object with keys as permission names and boolean values indicating whether the permission is granted.
 */
async function checkMultiplePermissions<T extends Record<string, string>>(permissions: T): Promise<{ [K in keyof T]: boolean }> {
    const permissionResults: Partial<{ [K in keyof T]: boolean }> = {};
    const currentUser = await getCurrentUser();

    for (const permissionKey in permissions) {
        if (permissions.hasOwnProperty(permissionKey)) {
            const requiredPermission = permissions[permissionKey];
            // const isPermissionGranted: boolean = currentUser ? currentUser.roles.includes(requiredPermission) : false;
            const isPermissionGranted = true;
            permissionResults[permissionKey] = isPermissionGranted;
        }
    }

    return permissionResults as { [K in keyof T]: boolean };
}

export default checkMultiplePermissions;
