"use server";

import prisma from "@/db";
import checkPermission from "@/modules/dashboard/services/checkPermission";
import ServerResponseAction from "@/modules/dashboard/types/ServerResponseAction";
import handleCatch from "@/modules/dashboard/utils/handleCatch";
import unauthorized from "@/modules/dashboard/utils/unauthorized";

interface Permission {
	id: string;
	code: string;
	name: string;
	description: string;
	isActive: boolean;
}

export default async function getPermissionById(
	id: string
): Promise<ServerResponseAction<Permission>> {
	try {
		if (!(await checkPermission("permissions.read"))) unauthorized();

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
	} catch (e) {
		return handleCatch(e);
	}
}
