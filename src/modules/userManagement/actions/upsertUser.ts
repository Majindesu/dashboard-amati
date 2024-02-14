"use server";

import mapObjectToFirstValue from "@/utils/mapObjectToFirstValue";
import prisma from "@/db";
import { revalidatePath } from "next/cache";
import userFormDataSchema, { UserFormData } from "../formSchemas/userFormSchema";
import checkPermission from "@/modules/dashboard/services/checkPermission";
import unauthorized from "@/modules/dashboard/utils/unauthorized";
import DashboardError from "@/modules/dashboard/errors/DashboardError";
import handleCatch from "@/modules/dashboard/utils/handleCatch";
import ServerResponseAction from "@/modules/dashboard/types/ServerResponseAction";

/**
 * Upserts a user based on the provided UserFormData.
 * If the user already exists (determined by `id`), it updates the user; otherwise, it creates a new user.
 * Authorization checks are performed based on whether it's a create or update operation.
 *
 * @param data - The data for creating or updating the user.
 * @returns An object containing the success status, message, and any errors.
 */
export default async function upsertUser(
	data: UserFormData
): Promise<ServerResponseAction> {
	try {
		const isInsert = !data.id;

		// Authorization check
		const permissionType = isInsert ? "users.create" : "users.update";
		if (!(await checkPermission(permissionType))) {
			return unauthorized();
		}

		// Validate form data
		const validatedFields = userFormDataSchema.safeParse(data);
		if (!validatedFields.success) {
			throw new DashboardError({
                errorCode: "INVALID_FORM_DATA",
                formErrors: mapObjectToFirstValue(validatedFields.error.flatten().fieldErrors)
            })
		}
		const userData = {
            id: validatedFields.data.id ? validatedFields.data.id : undefined,
			name: validatedFields.data.name,
            photoProfile: validatedFields.data.photoProfileUrl ?? "",
            email: validatedFields.data.email
		};

		// Database operation
		if (isInsert) {
            if (await prisma.user.findFirst({
                where: {
                    email: userData.email
                }
            })){
                throw new DashboardError({
                    errorCode: "INVALID_FORM_DATA",
                    formErrors: {
                        email: "The user is already exists"
                    }
                })
            }
			await prisma.user.create({ data: userData });
		} else {
			await prisma.user.update({
				where: { id: validatedFields.data.id! },
				data: userData,
			});
		}

		// Revalidate the cache
		revalidatePath(".");

		// Return success message
		return {
			success: true,
			message: `User ${validatedFields.data.name} has been successfully ${
				isInsert ? "created" : "updated"
			}.`,
		};
	} catch (error) {
		return handleCatch(error)
	}
}
