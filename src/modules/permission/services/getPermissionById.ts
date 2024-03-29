import db from "@/core/db";
import notFound from "@/modules/dashboard/utils/notFound";
import "server-only"

export default async function getPermissionById(id: string){
    const permission = await db.permission.findFirst({
        where: { id },
        select: {
            code: true,
            description: true,
            id: true,
            isActive: true,
            name: true,
        },
    });

    if (!permission) return notFound({
        message: "The permission does not exists"
    })

    return permission;
}