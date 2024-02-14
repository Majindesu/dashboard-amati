import DashboardError from "../errors/DashboardError";

/**
 * Throws a 'NOT_FOUND' DashboardError with a custom or default message.
 * @param message Optional custom message for the error.
 */
const notFound = ({ message }: { message?: string }) => {
	throw new DashboardError({
		errorCode: "NOT_FOUND",
		message:
			message ??
			"The requested data could not be located. It may have been deleted or relocated. Please verify the information or try a different request.",
	});
};

export default notFound;
