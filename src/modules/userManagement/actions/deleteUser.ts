"use server";

import prisma from "@/db";
import getCurrentUser from "@/modules/auth/utils/getCurrentUser";
import checkPermission from "@/modules/dashboard/services/checkPermission";
import ServerResponseAction from "@/modules/dashboard/types/ServerResponseAction";
import handleCatch from "@/modules/dashboard/utils/handleCatch";
import notFound from "@/modules/dashboard/utils/notFound";
import unauthorized from "@/modules/dashboard/utils/unauthorized";
import { revalidatePath } from "next/cache";
import UserManagementError from "../errors/UserManagementError";
import db from "@/core/db";

export default async function deleteUser(
	id: string
): Promise<ServerResponseAction> {
	try {
		const currentUser = await getCurrentUser();

		if (!(await checkPermission("users.delete")) || !currentUser)
			return unauthorized();

		//prevents self delete
		if (currentUser.id === id) {
			throw new UserManagementError({
				errorCode: "CANNOT_DELETE_SELF",
				message: "You cannot delete yourself",
			});
		}

		const user = await db.user.delete({
			where: { id },
		});

		if (!user) notFound({ message: "The user does not exists" });

		revalidatePath(".");

		return {
			success: true,
			message: "The user has been deleted successfully",
		};
	} catch (e: unknown) {
		return handleCatch(e);
	}
}
