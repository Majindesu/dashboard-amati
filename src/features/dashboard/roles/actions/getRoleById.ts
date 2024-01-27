"use server";

import { unauthorized } from "@/BaseError";
import prisma from "@/db";
import checkPermission from "@/features/auth/tools/checkPermission";

export default async function getRoleById(id: string) {
	if (!(await checkPermission("role.read"))) unauthorized();

	const role = await prisma.role.findFirst({
		where: { id },
		select: {
			code: true,
			description: true,
			id: true,
			isActive: true,
			name: true,
			permissions: {
				select: {
					id: true,
					code: true,
					name: true,
				},
			},
		},
	});

	if (!role) {
		return {
			success: false,
			message: "Role not found",
		} as const;
	}

	return {
		success: true,
		message: "Role fetched successfully",
		data: role,
	} as const;
}
