"use server";

import roleFormDataSchema, { RoleFormData } from "../formSchemas/RoleFormData";
import mapObjectToFirstValue from "@/utils/mapObjectToFirstValue";
import { revalidatePath } from "next/cache";
import ServerResponseAction from "@/modules/dashboard/types/ServerResponseAction";
import unauthorized from "@/modules/dashboard/utils/unauthorized";
import DashboardError from "@/modules/dashboard/errors/DashboardError";
import handleCatch from "@/modules/dashboard/utils/handleCatch";
import db from "@/core/db";
import checkPermission from "@/modules/auth/utils/checkPermission";
import upsertRole from "../services/upsertRole";

/**
 * Upserts a role based on the provided RoleFormData.
 * If the role already exists (determined by `id`), it updates the role; otherwise, it creates a new role.
 * Authorization checks are performed based on whether it's a create or update operation.
 *
 * @param data - The data for creating or updating the role.
 * @returns An object containing the success status, message, and any errors.
 */
export default async function upsertRoleAction(
	data: RoleFormData
): Promise<ServerResponseAction> {
	try {
		const isInsert = !data.id;

		// Authorization check
		const permissionType = isInsert ? "roles.create" : "roles.update";
		if (!(await checkPermission(permissionType))) {
			return unauthorized();
		}

		// Validate form data
		const result = await upsertRole(data);

		// Revalidate the cache
		revalidatePath(".");

		// Return success message
		return {
			success: true,
			message: `Role ${result.name} has been successfully ${
				isInsert ? "created" : "updated"
			}.`,
		};
	} catch (error) {
		return handleCatch(error);
	}
}
