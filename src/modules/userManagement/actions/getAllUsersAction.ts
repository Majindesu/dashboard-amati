"use server";

import ServerResponseAction from "@/modules/dashboard/types/ServerResponseAction";
import getAllUsers from "../services/getAllUsers";
import handleCatch from "@/modules/dashboard/utils/handleCatch";
import checkPermission from "@/modules/auth/utils/checkPermission";
import unauthorized from "@/modules/dashboard/utils/unauthorized";

export default async function getAllUsersAction(): Promise<
	ServerResponseAction<Awaited<ReturnType<typeof getAllUsers>>>
> {
	try {
		if (!(await checkPermission("users.readAll"))) unauthorized();

		const users = await getAllUsers();

		return {
			success: true,
			data: users,
		};
	} catch (e) {
		return handleCatch(e);
	}
}
