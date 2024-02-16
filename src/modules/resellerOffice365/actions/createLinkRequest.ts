"use server";
import checkPermission from "@/modules/dashboard/services/checkPermission";
import ServerResponseAction from "@/modules/dashboard/types/ServerResponseAction";
import handleCatch from "@/modules/dashboard/utils/handleCatch";
import unauthorized from "@/modules/dashboard/utils/unauthorized";
import "server-only";
import requestLinkFormSchema from "../formSchemas/requestLinkFormSchema";
import DashboardError from "@/modules/dashboard/errors/DashboardError";
import mapObjectToFirstValue from "@/utils/mapObjectToFirstValue";
import db from "@/core/db";
import getCurrentUser from "@/modules/auth/utils/getCurrentUser";
import { revalidatePath } from "next/cache";
import {server} from "../../../../server/socket";

export default async function createLinkRequest(
	formData: RequestLinkForm
): Promise<ServerResponseAction> {
	try {
		if (!(await checkPermission("office-365-request.create")))
			unauthorized();

		const currentUser = await getCurrentUser();
		if (!currentUser) return unauthorized();

		const validatedFields = requestLinkFormSchema.safeParse(formData);
		if (!validatedFields.success) {
			throw new DashboardError({
				errorCode: "INVALID_FORM_DATA",
				formErrors: mapObjectToFirstValue(
					validatedFields.error.flatten().fieldErrors
				),
			});
		}

		//database operations
		await db.office365LinkRequest.create({
			data: {
				creator: {
					connect: {
						id: currentUser.id,
					},
				},
				status: "WAITING",
				links: {
					createMany: {
						data: validatedFields.data.details.map((detail) => ({
							numberOfUsers: detail.endUserQty,
							activePeriod: detail.activePeriod,
							email: detail.email,
						})),
					},
				},
			},
		});

        revalidatePath(".")

		server.publish(`mwrl-${currentUser.id}`, "update")

		return {
			success: true,
			message:
				"Your request has been made. Please wait while our admin processing your request",
		};
	} catch (e) {
		return handleCatch(e);
	}
}
