"use server";

import ServerResponseAction from "@/modules/dashboard/types/ServerResponseAction";
import handleCatch from "@/modules/dashboard/utils/handleCatch";
import unauthorized from "@/modules/dashboard/utils/unauthorized";
import { revalidatePath } from "next/cache";
import deletePermission from "../services/deletePermission";
import checkPermission from "@/modules/auth/utils/checkPermission";

export default async function deletePermissionAction(
	id: string
): Promise<ServerResponseAction> {
	try {
		if (!(await checkPermission("permissions.delete"))) unauthorized();

		await deletePermission(id);
		revalidatePath(".");

		return {
			success: true,
			message: "The permission has been deleted successfully",
		};
	} catch (e: unknown) {
		return handleCatch(e);
	}
}
