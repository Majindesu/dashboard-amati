"use server";

import prisma from "@/db";
import checkPermission from "@/features/auth/tools/checkPermission";
import { handleCatch, unauthorized } from "../../errors/DashboardError";
import ServerResponse from "@/types/Action";
import { revalidatePath } from "next/cache";

export default async function deletePermission(id: string): Promise<ServerResponse> {
    try {
        if (!(await checkPermission("permission.delete"))) return unauthorized();
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
