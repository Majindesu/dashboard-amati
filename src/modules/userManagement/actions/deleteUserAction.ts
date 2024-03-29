"use server";

import ServerResponseAction from "@/modules/dashboard/types/ServerResponseAction";
import handleCatch from "@/modules/dashboard/utils/handleCatch";
import unauthorized from "@/modules/dashboard/utils/unauthorized";
import { revalidatePath } from "next/cache";
import deleteUser from "../services/deleteUser";
import checkPermission from "@/modules/auth/utils/checkPermission";

export default async function deleteUserAction(
	id: string
): Promise<ServerResponseAction> {
	try {

		if (!(await checkPermission("users.delete")))
			return unauthorized();

		await deleteUser(id);

		revalidatePath(".");

		return {
			success: true,
			message: "The user has been deleted successfully",
		};
	} catch (e: unknown) {
		return handleCatch(e);
	}
}
