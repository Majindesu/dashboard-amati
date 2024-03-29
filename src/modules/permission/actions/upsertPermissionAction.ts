"use server";

import { PermissionFormData } from "../formSchemas/PermissionFormData";
import { revalidatePath } from "next/cache";
import ServerResponseAction from "@/modules/dashboard/types/ServerResponseAction";
import unauthorized from "@/modules/dashboard/utils/unauthorized";
import handleCatch from "@/modules/dashboard/utils/handleCatch";
import checkPermission from "@/modules/auth/utils/checkPermission";
import upsertPermission from "../services/upsertPermission";

/**
 * Upserts a permission based on the provided PermissionFormData.
 * If the permission already exists (determined by `id`), it updates the permission; otherwise, it creates a new permission.
 * Authorization checks are performed based on whether it's a create or update operation.
 *
 * @param data - The data for creating or updating the permission.
 * @returns An object containing the success status, message, and any errors.
 */
export default async function upsertPermissionAction(
	data: PermissionFormData
): Promise<ServerResponseAction> {
	try {
		const isInsert = !data.id;

		// Authorization check
		const permissionType = isInsert
			? "permissions.create"
			: "permissions.update";
		if (!(await checkPermission(permissionType))) {
			unauthorized();
		}

		const result = await upsertPermission(data);

		// Revalidate the cache
		revalidatePath(".");

		// Return success message
		return {
			success: true,
			message: `Permission ${result.name} has been successfully ${
				isInsert ? "created" : "updated"
			}.`,
		};
	} catch (error) {
		return handleCatch(error);
	}
}
