"use server";

import prisma from "@/db";
import checkPermission from "@/features/auth/tools/checkPermission";
import { handleCatch, unauthorized } from "../../errors/DashboardError";
import ServerResponse from "@/types/Action";
import { revalidatePath } from "next/cache";

export default async function deleteRole(id: string): Promise<ServerResponse> {
    try {
        if (!(await checkPermission("role.delete"))) return unauthorized();
		const role = await prisma.role.delete({
			where: { id },
		});


        revalidatePath(".")

		return {
			success: true,
			message: "The role has been deleted successfully",
		};
	} catch (e: unknown) {
        return handleCatch(e)
	}
}
