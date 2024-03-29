"use server";

import checkPermission from "@/modules/auth/utils/checkPermission";
import ServerResponseAction from "@/modules/dashboard/types/ServerResponseAction";
import handleCatch from "@/modules/dashboard/utils/handleCatch";
import unauthorized from "@/modules/dashboard/utils/unauthorized";
import getPermissionById from "../services/getPermissionById";

interface Permission {
	id: string;
	code: string;
	name: string;
	description: string;
	isActive: boolean;
}

export default async function getPermissionByIdAction(
	id: string
): Promise<ServerResponseAction<Permission>> {
	try {
		if (!(await checkPermission("permissions.read"))) unauthorized();

		const permission = await getPermissionById(id);

		return {
			success: true,
			data: permission,
		} as const;
	} catch (e) {
		return handleCatch(e);
	}
}
