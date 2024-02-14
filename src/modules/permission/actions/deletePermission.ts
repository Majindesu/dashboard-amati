"use server";

import prisma from "@/db";
import checkPermission from "@/modules/dashboard/services/checkPermission";
import ServerResponseAction from "@/modules/dashboard/types/ServerResponseAction";
import handleCatch from "@/modules/dashboard/utils/handleCatch";
import unauthorized from "@/modules/dashboard/utils/unauthorized";
import { revalidatePath } from "next/cache";

export default async function deletePermission(id: string): Promise<ServerResponseAction> {
    try {
        if (!(await checkPermission("permission.delete"))) unauthorized();
		const permission = await prisma.permission.delete({
			where: { id },
		});


        revalidatePath(".")

		return {
			success: true,
			message: "The permission has been deleted successfully",
		};
	} catch (e: unknown) {
        return handleCatch(e)
	}
}
