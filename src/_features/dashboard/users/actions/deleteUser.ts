"use server";

import checkPermission from "@/features/auth/tools/checkPermission";
import prisma from "@/db";
import { revalidatePath } from "next/cache";

/**
 * Deletes a user from the database based on their ID.
 * 
 * @param {string} id The unique identifier of the user to be deleted.
 * @returns A promise that resolves to an object indicating the success or failure of the operation.
 */
export default async function deleteUser(id: string) {

    // Check user permission
	if (!(await checkPermission())) return {
        success: false,
        message: "Unauthorized"
    } as const;

    // Find the user in the database
	const user = await prisma.user.findFirst({
		where: { id },
	});

    // Handle case where user is not found
    if (!user) return {
        success: false,
        message: "User not found"
    } as const;

    // Delete the user
	await prisma.user.delete({
        where: { id }
    });

    // Revalidate cache
    revalidatePath(".");

    return {
        success: true,
        message: `User ${user.name} has been successfully deleted`
    } as const;
}
