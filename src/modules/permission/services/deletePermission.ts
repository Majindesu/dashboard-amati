import "server-only"
import db from "@/core/db";
import notFound from "@/modules/dashboard/utils/notFound";

export default async function deletePermission(id: string) {
	const permission = await db.permission.delete({
		where: { id },
	});

    if (!permission) return notFound({
        message: "The permission does not exists"
    });

    return true as const;
}
