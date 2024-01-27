"use server"
import checkPermission from "@/features/auth/tools/checkPermission";
import roleFormDataSchema, { RoleFormData } from "../formSchemas/RoleFormData";
import { unauthorized } from "@/BaseError";
import mapObjectToFirstValue from "@/utils/mapObjectToFirstValue";
import prisma from "@/db";
import { revalidatePath } from "next/cache";

export default async function upsertRole(data: RoleFormData){
    
    const isInsert = !!data.id;

    if (isInsert && !await checkPermission("role.create")){
        return unauthorized();
    }

    if (!isInsert && !await checkPermission("role.update")){
        return unauthorized();
    }

    const validatedFields = roleFormDataSchema.safeParse(data);
    if (!validatedFields.success){
        return {
            success: false,
            message: "Invalid Form Data",
            errors: mapObjectToFirstValue(validatedFields.error.flatten().fieldErrors)
        } as const
    }

    // Update user data in the database
    try {
        if (isInsert){
            await prisma.role.update({
                where: { id: validatedFields.data.id!},
                data: {
                    code: validatedFields.data.code,
                    description: validatedFields.data.description,
                    isActive: validatedFields.data.isActive,
                    name: validatedFields.data.name
                },
            })
        } else {
            await prisma.role.create({
                data: {
                    code: validatedFields.data.code,
                    description: validatedFields.data.description,
                    name: validatedFields.data.name,
                    isActive: validatedFields.data.isActive
                }
            })
        }

        // Revalidate the cache
        revalidatePath(".");

        return {
            success: true,
            message: `Role ${validatedFields.data.name} has been successfully ${isInsert ? "Updated" : "Created"}`
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