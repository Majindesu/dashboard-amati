"use server"
import checkPermission from "@/modules/dashboard/services/checkPermission";
import ServerResponseAction from "@/modules/dashboard/types/ServerResponseAction";
import handleCatch from "@/modules/dashboard/utils/handleCatch";
import unauthorized from "@/modules/dashboard/utils/unauthorized";
import RequestLinkWithIssuerData from "../types/RequestLinkWithIssuerData";
import db from "@/core/db";
import { string } from "zod";
import notFound from "@/modules/dashboard/utils/notFound";

async function getOffice365LinkRequestData(id: string) {
	const data = await db.office365LinkRequest.findFirst({
		where: { id },
		select: {
			acceptedAt: true,
			cancelledAt: true,
			creator: {
				select: {
					name: true,
					id: true,
					email: true,
				},
			},
			id: true,
			links: {
				select: {
					activePeriod: true,
					email: true,
					id: true,
					link: true,
					numberOfUsers: true,
				},
			},
			rejectedAt: true,
			requestedAt: true,
			status: true,
		},
	});

	return data;
}

export default async function getLinkRequestDataById(
	id: string
): Promise<
	ServerResponseAction<
		NonNullable<Awaited<ReturnType<typeof getOffice365LinkRequestData>>>
	>
> {
	try {
		//TODO: Adjust permission
		if (!(await checkPermission("authenticated-only")))
			return unauthorized();

		const data = await getOffice365LinkRequestData(id);

		if (!data) {
			return notFound({
				message: "The requested link request item is not found",
			});
		}

		return {
			success: true,
			data,
		};
	} catch (e) {
		return handleCatch(e);
	}
}
