"use server";

import prisma from "@/db";
import checkPermission from "@/modules/dashboard/services/checkPermission";
import ServerResponseAction from "@/modules/dashboard/types/ServerResponseAction";
import handleCatch from "@/modules/dashboard/utils/handleCatch";
import notFound from "@/modules/dashboard/utils/notFound";
import unauthorized from "@/modules/dashboard/utils/unauthorized";
import { revalidatePath } from "next/cache";

export default async function deleteUser(
	id: string
): Promise<ServerResponseAction> {
	try {
		if (!(await checkPermission("users.delete"))) return unauthorized();
		const user = await prisma.user.delete({
			where: { id },
		});

		if (!user) notFound({message: "The user does not exists"});

		revalidatePath(".");

		return {
			success: true,
			message: "The user has been deleted successfully",
		};
	} catch (e: unknown) {
		return handleCatch(e);
	}
}
