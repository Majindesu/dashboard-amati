import "server-only"
import prisma from "@/db";
import { notFound } from "next/navigation";
import checkPermission from "@/features/auth/tools/checkPermission";
import { unauthorized } from "@/BaseError";

/**
 * Retrieves detailed information of a user by their ID.
 * 
 * @param id The unique identifier of the user.
 * @returns The user's detailed information or an error response.
 */
export default async function getUserDetailById(id: string){

    // Check user permission
    if (!checkPermission("authenticated-only")) return unauthorized();
    
    // Retrieve user data from the database
    const user = await prisma.user.findFirst({
        where: { id },
        select: {
            id: true,
            email: true,
            name: true,
            photoProfile: {
                select: {
                    path: true
                }
            },
        }
    })

    // Check if user exists
    if (!user) return notFound();

    // Format user data
    const formattedUser = {
        id: user.id,
        email: user.email ?? "",
        name: user.name ?? "",
        photoProfileUrl: user.photoProfile?.path ?? ""
    }

    return formattedUser;
}
