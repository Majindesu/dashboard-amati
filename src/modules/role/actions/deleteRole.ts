"use server";

import prisma from "@/db";
import checkPermission from "@/modules/dashboard/services/checkPermission";
import ServerResponseAction from "@/modules/dashboard/types/ServerResponseAction";
import handleCatch from "@/modules/dashboard/utils/handleCatch";
import unauthorized from "@/modules/dashboard/utils/unauthorized";
import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";

export default async function deleteRole(
	id: string
): Promise<ServerResponseAction> {
	try {
		if (!(await checkPermission("roles.delete"))) return unauthorized();
		const role = await prisma.role.delete({
			where: { id },
		});

		revalidatePath(".");

		return {
			success: true,
			message: "The role has been deleted successfully",
		};
	} catch (e: unknown) {
		return handleCatch(e);
	}
}
