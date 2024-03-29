import getCurrentUser from "@/modules/auth/services/getCurrentUser"
import unauthorized from "@/modules/dashboard/utils/unauthorized";
import "server-only"
import UserManagementError from "../errors/UserManagementError";
import db from "@/core/db";
import notFound from "@/modules/dashboard/utils/notFound";

export default async function deleteUser(id: string){
    const currentUser = await getCurrentUser();
    
    if (!currentUser) return unauthorized();

    if (currentUser.id !== id) throw new UserManagementError({
        errorCode: "CANNOT_DELETE_SELF",
        message: "You cannot delete yourself",
        statusCode: 403,
    });

    const user = await db.user.delete({
        where: { id },
    });

    if (!user) return notFound({message: "The user does not exists"})

    return true as const;
}