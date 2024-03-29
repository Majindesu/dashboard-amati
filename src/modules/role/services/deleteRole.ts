import db from "@/core/db";
import notFound from "@/modules/dashboard/utils/notFound";

export default async function deleteRole(id: string) {
    const role = await db.role.delete({
        where: { id },
    });

    if (!role) notFound({message: "The role doesn't exists"})

    return true as const;
}