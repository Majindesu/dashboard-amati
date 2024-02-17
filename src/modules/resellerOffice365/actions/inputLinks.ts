"use server";
import db from "@/core/db";
import checkPermission from "@/modules/dashboard/services/checkPermission";
import ServerResponseAction from "@/modules/dashboard/types/ServerResponseAction";
import handleCatch from "@/modules/dashboard/utils/handleCatch";
import notFound from "@/modules/dashboard/utils/notFound";
import unauthorized from "@/modules/dashboard/utils/unauthorized";
import "server-only";
import ResellerOffice365Error from "../errors/ResellerOffice365Error";
import { revalidatePath } from "next/cache";

interface Args {
	id: string;
	data: {
		linkId: string;
		link: string;
	}[];
}

export default async function inputLink(
	args: Args
): Promise<ServerResponseAction> {
	try {
		//TODO: Implement permission
		if (!(await checkPermission("authenticated-only")))
			return unauthorized();

		const data = await db.office365LinkRequest.findFirst({
			where: {
				id: args.id,
			},
			include: {
				links: true,
			},
		});

		if (!data)
			return notFound({
				message:
					"The requested link is not found. It might seems has been deleted. Please contact administrator",
			});

		if (data.status !== "WAITING")
			throw new ResellerOffice365Error({
				errorCode: "REQUEST_IS_NOT_IN_WAITING_STATE",
				message: `This request has been ${
					data.acceptedAt
						? "completed"
						: data.rejectedAt
						? "rejected"
						: "cancelled"
				} thus cannot be updated. Please contact administrator`,
			});

		await db.office365LinkRequest.update({
			where: {
				id: args.id,
			},
			data: {
				acceptedAt: new Date(),
                status: "ACCEPTED",
				links: {
					updateMany: args.data.map((linkItem) => ({
						where: { id: linkItem.linkId },
						data: {
							link: linkItem.link,
						},
					})),
				},
			},
		});

        revalidatePath(".")

		return {
			success: true,
		};
	} catch (e) {
		return handleCatch(e);
	}
}
