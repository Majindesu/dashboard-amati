"use server";

import { revalidatePath } from "next/cache";
import { UserFormData } from "../formSchemas/userFormSchema";
import unauthorized from "@/modules/dashboard/utils/unauthorized";
import handleCatch from "@/modules/dashboard/utils/handleCatch";
import ServerResponseAction from "@/modules/dashboard/types/ServerResponseAction";
import checkPermission from "@/modules/auth/utils/checkPermission";
import upsertUser from "../services/upsertUser";

/**
 * Upserts a user based on the provided UserFormData.
 * If the user already exists (determined by `id`), it updates the user; otherwise, it creates a new user.
 * Authorization checks are performed based on whether it's a create or update operation.
 *
 * @param data - The data for creating or updating the user.
 * @returns An object containing the success status, message, and any errors.
 */
export default async function upsertUserAction(
	data: UserFormData
): Promise<ServerResponseAction> {
	try {
		const isInsert = !data.id;

		// Authorization check
		const permissionType = isInsert ? "users.create" : "users.update";
		if (!(await checkPermission(permissionType))) {
			return unauthorized();
		}

		const user = await upsertUser(data);

		// Revalidate the cache
		revalidatePath(".");

		// Return success message
		return {
			success: true,
			message: `User ${user.name} has been successfully ${
				isInsert ? "created" : "updated"
			}.`,
		};
	} catch (error) {
		return handleCatch(error);
	}
}
