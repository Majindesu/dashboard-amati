"use server";

import checkPermission from "@/features/auth/tools/checkPermission";
import roleFormDataSchema, { RoleFormData } from "../formSchemas/RoleFormData";
import { unauthorized } from "@/BaseError";
import mapObjectToFirstValue from "@/utils/mapObjectToFirstValue";
import prisma from "@/db";
import { revalidatePath } from "next/cache";

/**
 * Upserts a role based on the provided RoleFormData.
 * If the role already exists (determined by `id`), it updates the role; otherwise, it creates a new role.
 * Authorization checks are performed based on whether it's a create or update operation.
 *
 * @param {RoleFormData} data - The data for creating or updating the role.
 * @returns {Promise<object>} An object containing the success status, message, and any errors.
 */
export default async function upsertRole(data: RoleFormData) {
    const isInsert = !data.id;

    // Authorization check
    const permissionType = isInsert ? "role.create" : "role.update";
    if (!await checkPermission(permissionType)) {
        return unauthorized();
    }

    // Validate form data
    const validatedFields = roleFormDataSchema.safeParse(data);
    if (!validatedFields.success) {
        return {
            success: false,
            message: "Invalid Form Data",
            errors: mapObjectToFirstValue(validatedFields.error.flatten().fieldErrors),
        };
    }

    try {
        const roleData = {
            code: validatedFields.data.code,
            description: validatedFields.data.description,
            name: validatedFields.data.name,
            isActive: validatedFields.data.isActive,
        };

        // Database operation
        if (isInsert) {
            await prisma.role.create({ data: roleData });
        } else {
            await prisma.role.update({
                where: { id: validatedFields.data.id! },
                data: roleData,
            });
        }

        // Revalidate the cache
        revalidatePath(".");

        // Return success message
        return {
            success: true,
            message: `Role ${validatedFields.data.name} has been successfully ${isInsert ? "created" : "updated"}.`,
        };
    } catch (error) {
        console.error('Error updating role data', error);
        return {
            success: false,
            message: "Error updating role data.",
        };
    }
}
