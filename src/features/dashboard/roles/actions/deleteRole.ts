"use server";

import { unauthorized } from "@/BaseError";
import prisma from "@/db";
import checkPermission from "@/features/auth/tools/checkPermission";

export default async function deleteRole(id: string) {
	if (!(await checkPermission("role.delete"))) return unauthorized();

	try {
		const role = await prisma.role.delete({
			where: { id },
		});

		return {
			success: true,
			message: "The role has been deleted successfully",
		} as const;
	} catch (e) {
		//TODO: Handle error
		return {
			success: false,
			message: "Unable to delete the role",
		} as const;
	}
}
