import { Prisma } from "@prisma/client";
import DashboardError from "../errors/DashboardError";
import "server-only"

/**
 * Handles exceptions and converts them into a structured error response.
 * @param e The caught error or exception.
 */
const handleCatch = (e: unknown) => {
	console.error(e)
	if (e instanceof DashboardError) {
		return e.getErrorReponseObject();
	}
	if (e instanceof Prisma.PrismaClientKnownRequestError) {
		//Not found
		if (e.code === "P2025") {
			const error = new DashboardError({
				errorCode: "NOT_FOUND",
				message:
					"The requested data could not be located. It may have been deleted or relocated. Please verify the information or try a different request.",
			});
			return error.getErrorReponseObject();
		}
	}
	if (e instanceof Error) {
		return {
			success: false,
			dashboardError: false,
			message: e.message,
		} as const;
	} else {
		return {
			success: false,
			dashboardError: false,
			message: "Unkown error",
		} as const;
	}
};

export default handleCatch;
