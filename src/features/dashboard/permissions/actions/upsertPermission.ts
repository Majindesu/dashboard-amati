"use server";

import checkPermission from "@/features/auth/tools/checkPermission";
import permissionFormDataSchema, { PermissionFormData } from "../formSchemas/PermissionFormData";
import mapObjectToFirstValue from "@/utils/mapObjectToFirstValue";
import prisma from "@/db";
import { revalidatePath } from "next/cache";
import ServerResponse from "@/types/Action";
import DashboardError, { handleCatch, unauthorized } from "../../errors/DashboardError";

/**
 * Upserts a permission based on the provided PermissionFormData.
 * If the permission already exists (determined by `id`), it updates the permission; otherwise, it creates a new permission.
 * Authorization checks are performed based on whether it's a create or update operation.
 *
 * @param data - The data for creating or updating the permission.
 * @returns An object containing the success status, message, and any errors.
 */
export default async function upsertPermission(
	data: PermissionFormData
): Promise<ServerResponse> {
	try {
		const isInsert = !data.id;

		// Authorization check
		const permissionType = isInsert ? "permission.create" : "permission.update";
		if (!(await checkPermission(permissionType))) {
			return unauthorized();
		}

		// Validate form data
		const validatedFields = permissionFormDataSchema.safeParse(data);
		if (!validatedFields.success) {
			throw new DashboardError({
                errorCode: "INVALID_FORM_DATA",
                formErrors: mapObjectToFirstValue(validatedFields.error.flatten().fieldErrors)
            })
		}
		const permissionData = {
			code: validatedFields.data.code,
			description: validatedFields.data.description,
			name: validatedFields.data.name,
			isActive: validatedFields.data.isActive,
		};

		// Database operation
		if (isInsert) {
            if (await prisma.permission.findFirst({
                where: {
                    code: permissionData.code
                }
            })){
                throw new DashboardError({
                    errorCode: "INVALID_FORM_DATA",
                    formErrors: {
                        code: "The code is already exists"
                    }
                })
            }
			await prisma.permission.create({ data: permissionData });
		} else {
			await prisma.permission.update({
				where: { id: validatedFields.data.id! },
				data: permissionData,
			});
		}

		// Revalidate the cache
		revalidatePath(".");

		// Return success message
		return {
			success: true,
			message: `Permission ${validatedFields.data.name} has been successfully ${
				isInsert ? "created" : "updated"
			}.`,
		};
	} catch (error) {
		return handleCatch(error)
	}
}