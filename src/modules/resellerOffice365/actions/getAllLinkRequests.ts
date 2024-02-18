import checkPermission from "@/modules/dashboard/services/checkPermission";
import ServerResponseAction from "@/modules/dashboard/types/ServerResponseAction";
import handleCatch from "@/modules/dashboard/utils/handleCatch";
import unauthorized from "@/modules/dashboard/utils/unauthorized";
import db from "@/core/db";
import RequestLinkWithIssuerData from "../types/RequestLinkWithIssuerData";

export default async function getAllLinkRequests(): Promise<
	ServerResponseAction<RequestLinkWithIssuerData[]>
> {
	try {
		//TODO: Fix permission check
		if (!(await checkPermission("authenticated-only")))
			return unauthorized();

		const requestLinks = await db.office365LinkRequest.findMany({
			orderBy: [
                {
                    status: "asc"
                },
                {
                    requestedAt: "desc"
                }
            ],
			select: {
				id: true,
				creator: {
					select: {
						id: true,
						name: true,
						photoProfile: true,
						email: true,
					},
				},
				status: true,
				requestedAt: true,
				_count: {
					select: {
						links: true,
					},
				},
			},
		});

		return {
			success: true,
			data: requestLinks.map((item) => ({
				...item,
				userCount: item._count.links,
			})),
		};
	} catch (e) {
		return handleCatch(e);
	}
}
