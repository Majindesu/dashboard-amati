"use server";

import prisma from "@/db";
import userFormDataSchema, { UserFormData } from "../formSchemas/userFormDataSchema";
import checkPermission from "@/features/auth/tools/checkPermission";
import { revalidatePath } from "next/cache";
import mapObjectToFirstValue from "@/utils/mapObjectToFirstValue";

/**
 * Edits user data in the database based on the provided form data.
 * 
 * @param formData The user data to be updated.
 * @returns A promise that resolves to an object indicating the success or failure of the operation.
 */
export default async function editUser(formData: UserFormData) {

    // Check user permission
    if (!await checkPermission("authenticated-only")) return {
        success: false,
        message: "Unauthorized"
    }
	
    // Validate form data
    const validatedFields = userFormDataSchema.safeParse(formData);
    if (!validatedFields.success){
        return {
            success: false,
            message: "Invalid Form Data",
            errors: mapObjectToFirstValue(validatedFields.error.flatten().fieldErrors)
        } as const
    }

    // Check for valid ID
    if (!validatedFields.data.id){
        return {
            success: false,
            message: "Invalid Form Data",
            errors: {
                id: "Invalid ID"
            }
        } as const
    }

    // Update user data in the database
    try {
        await prisma.user.update({
            where: { id: validatedFields.data.id },
            data: {
                email: validatedFields.data.email,
                name: validatedFields.data.name,
            }
        });

        // Revalidate the cache
        revalidatePath(".");

        return {
            success: true,
            message: `User ${validatedFields.data.name} has been successfully updated`
        };
    } catch (error) {
        // Consider handling specific database errors here
        console.error('Error updating user data', error);
        return {
            success: false,
            message: "Error updating user data"
        };
    }
}
