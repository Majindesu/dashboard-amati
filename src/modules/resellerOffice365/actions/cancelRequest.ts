"use server";

import db from "@/core/db";
import checkPermission from "@/modules/dashboard/services/checkPermission";
import handleCatch from "@/modules/dashboard/utils/handleCatch";
import notFound from "@/modules/dashboard/utils/notFound";
import unauthorized from "@/modules/dashboard/utils/unauthorized";
import ResellerOffice365Error from "../errors/ResellerOffice365Error";
import getCurrentUser from "@/modules/auth/utils/getCurrentUser";
import ServerResponseAction from "@/modules/dashboard/types/ServerResponseAction";
import { revalidatePath } from "next/cache";
import "server-only"

export default async function cancelRequest(id: string): Promise<ServerResponseAction> {
	try {
		//TODO: Fix permission
		if (!(await checkPermission("authenticated-only"))) return unauthorized();

		const data = await db.office365LinkRequest.findFirst({
			where: { id },
		});

        if (!data) return notFound({message: "The Provided ID does not match any"})

        if (data.status !== "WAITING") throw new ResellerOffice365Error({
            errorCode: "REQUEST_IS_NOT_IN_WAITING_STATE",
            message: "This item is not in \"waiting\" state to perform cancellation. This might be due to the request has been accepted"
        });

        if (data.createdBy !== (await getCurrentUser())?.id) return unauthorized();

        await db.office365LinkRequest.update({
            where: {id},
            data: {
                status: "CANCELLED",
                cancelledAt: new Date()
            }
        })

        revalidatePath(".")

        return {
            success: true
        }
	} catch (e) {
		return handleCatch(e);
	}
}
