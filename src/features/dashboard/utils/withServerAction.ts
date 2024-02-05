import ServerResponse, { SuccessResponse } from "@/types/Action";
import DashboardError from "../errors/DashboardError";

/**
 * A higher-order function that wraps an async function and provides structured error handling.
 * If the wrapped function returns a successful response, it's returned directly.
 * If an error occurs, it throws a DashboardError for dashboard-related errors or a generic Error otherwise.
 * 
 * @param asyncFunction - The async function to wrap.
 * @param args - The arguments to pass to the async function.
 * @returns The successful response from the async function.
 * @throws DashboardError for dashboard-related errors or Error for other errors.
 */
async function withErrorHandling<T, Args extends unknown[] = []>(
	asyncFunction: (...args: Args) => Promise<ServerResponse<T>>,
	...args: Args
){
	const result = await asyncFunction(...args);
	if (result.success === true) {
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
