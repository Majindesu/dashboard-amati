import ServerResponseAction from "@/modules/dashboard/types/ServerResponseAction";
import RequestLink from "../types/RequestLink";
import handleCatch from "@/modules/dashboard/utils/handleCatch";
import checkPermission from "@/modules/dashboard/services/checkPermission";
import unauthorized from "@/modules/dashboard/utils/unauthorized";
import getCurrentUser from "@/modules/auth/utils/getCurrentUser";
import db from "@/core/db";

export default async function getLinkRequests(): Promise<
	ServerResponseAction<RequestLink[]>
> {
	try {
		if (!(await checkPermission("office-365-request.getMine")))
			unauthorized();

		const user = await getCurrentUser();

		if (!user) return unauthorized();

		const requests = await db.office365LinkRequest.findMany({
			orderBy: [
                {
                    status: "asc"
                },
                {
                    requestedAt: "desc"
                }
            ],
			where: {
				creator: { id: user.id },
			},
			select: {
				id: true,
				requestedAt: true,
				status: true,
				links: true,
			},
		});

		const result: RequestLink[] = requests.map((request) => ({
			id: request.id,
			requestDate: request.requestedAt.toISOString(),
			status: request.status,
			userCount: request.links.reduce(
				(prev, curr) => prev + curr.numberOfUsers,
				0
			),
		}));

		return {
			success: true,
			data: result,
		};
	} catch (e) {
		return handleCatch(e);
	}
}
