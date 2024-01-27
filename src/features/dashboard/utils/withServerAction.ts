import ServerResponse from "@/types/Action";
import DashboardError from "../errors/DashboardError";

async function withErrorHandling<T extends ServerResponse>(
	asyncFunction: () => Promise<T>
): Promise<T> {
	const result = await asyncFunction();
	if (result.success) {
        return result;
	} else {
        if (result.dashboardError && result.error) {
			const errorDetails = result.error;
			throw new DashboardError({
				message: errorDetails.message,
				errorCode: errorDetails.errorCode,
				formErrors: errorDetails.errors,
			});
		} else {
			// Handle non-dashboard errors
			throw new Error(result.message ?? "Unknown error occurred.");
		}
	}
}

export default withErrorHandling;
