"use server"

import checkPermission from "@/features/auth/tools/checkPermission"
import { handleCatch, notFound, unauthorized } from "../../errors/DashboardError"
import ServerResponse from "@/types/Action";

type PermissionData = {
    code: string,
    name: string,
}

/**
 * Retrieves all active permissions from the database if the user has the 'permissions.readAll' permission.
 *
 * @returns A structured server response containing the list of permissions or an error message.
 */
export default async function getAllPermissions(): Promise<ServerResponse<PermissionData[]>>{
    try {
        // Check if the user has the required permission
        if (!await checkPermission("permissions.readAll")) return unauthorized()
        
        // Fetch active permissions from the database
        const permissions = await prisma?.permission.findMany({
            where: {
                isActive: true
            },
            select: {
                code: true,
                name: true,
            }
        });

        // If no permissions are found, throw a custom 'not found' error
        if (!permissions || permissions.length === 0) {
            return notFound({ message: "No active permissions found." });
        }

        // Return the permissions in a structured server response
        return {
            success: true,
            message: "Permissions fetched",
            data: permissions
        }
    } catch (e){
        return handleCatch(e)
    }

}