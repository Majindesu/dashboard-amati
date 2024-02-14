"use server";

import { unauthorized } from "@/BaseError";
import prisma from "@/db";
import checkPermission from "@/features/auth/tools/checkPermission";

export default async function getPermissionById(id: string) {
	if (!(await checkPermission("permission.read"))) unauthorized();

	const permission = await prisma.permission.findFirst({
		where: { id },
		select: {
			code: true,
			description: true,
			id: true,
			isActive: true,
			name: true,
		},
	});

	if (!permission) {
		return {
			success: false,
			message: "Permission not found",
		} as const;
	}

	return {
		success: true,
		message: "Permission fetched successfully",
		data: permission,
	} as const;
}
