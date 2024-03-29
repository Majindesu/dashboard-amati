"use server";

import checkPermission from "@/modules/auth/utils/checkPermission";
import ServerResponseAction from "@/modules/dashboard/types/ServerResponseAction";
import handleCatch from "@/modules/dashboard/utils/handleCatch";
import unauthorized from "@/modules/dashboard/utils/unauthorized";
import { revalidatePath } from "next/cache";
import deleteRole from "../services/deleteRole";

export default async function deleteRoleAction(
	id: string
): Promise<ServerResponseAction> {
	try {
		if (!(await checkPermission("roles.delete"))) return unauthorized();

		await deleteRole(id);

		revalidatePath(".");

		return {
			success: true,
			message: "The role has been deleted successfully",
		};
	} catch (e: unknown) {
		return handleCatch(e);
	}
}
