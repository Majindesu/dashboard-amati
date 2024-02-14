"use server";

import checkPermission from "@/features/auth/tools/checkPermission";
import roleFormDataSchema, { RoleFormData } from "../formSchemas/RoleFormData";
import mapObjectToFirstValue from "@/utils/mapObjectToFirstValue";
import prisma from "@/db";
import { revalidatePath } from "next/cache";
import ServerResponse from "@/types/Action";
import DashboardError, {
	handleCatch,
	unauthorized,
} from "../../errors/DashboardError";

/**
 * Upserts a role based on the provided RoleFormData.
 * If the role already exists (determined by `id`), it updates the role; otherwise, it creates a new role.
 * Authorization checks are performed based on whether it's a create or update operation.
 *
 * @param data - The data for creating or updating the role.
 * @returns An object containing the success status, message, and any errors.
 */
export default async function upsertRole(
	data: RoleFormData
): Promise<ServerResponse> {
	try {
		const isInsert = !data.id;

		// Authorization check
		const permissionType = isInsert ? "role.create" : "role.update";
		if (!(await checkPermission(permissionType))) {
			return unauthorized();
		}

		// Validate form data
		const validatedFields = roleFormDataSchema.safeParse(data);
		if (!validatedFields.success) {
			throw new DashboardError({
				errorCode: "INVALID_FORM_DATA",
				formErrors: mapObjectToFirstValue(
					validatedFields.error.flatten().fieldErrors
				),
			});
		}
		const roleData = {
			code: validatedFields.data.code,
			description: validatedFields.data.description,
			name: validatedFields.data.name,
			isActive: validatedFields.data.isActive,
		};

		const permissionIds = validatedFields.data.permissions.map(
			(permission) => ({ code: permission })
		);

		// Database operation
		if (isInsert) {
			if (
				await prisma.role.findFirst({
					where: {
						code: roleData.code,
					},
				})
			) {
				throw new DashboardError({
					errorCode: "INVALID_FORM_DATA",
					formErrors: {
						code: "The code is already exists",
					},
				});
			}
			await prisma.role.create({
				data: {
					...roleData,
					permissions: {
						connect: permissionIds,
					},
				},
			});
		} else {
			await prisma.role.update({
				where: { id: validatedFields.data.id! },
				data: { ...roleData, permissions: { connect: permissionIds } },
			});
		}

		// Revalidate the cache
		revalidatePath(".");

		// Return success message
		return {
			success: true,
			message: `Role ${validatedFields.data.name} has been successfully ${
				isInsert ? "created" : "updated"
			}.`,
		};
	} catch (error) {
		return handleCatch(error);
	}
}
