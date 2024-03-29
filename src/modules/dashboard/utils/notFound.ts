import BaseError from "@/core/error/BaseError";

/**
 * Throws a 'NOT_FOUND' DashboardError with a custom or default message.
 * @param message Optional custom message for the error.
 */
const notFound = ({ message }: { message?: string }) => {
	throw new BaseError({
		errorCode: "NOT_FOUND",
		message:
			message ??
			"The requested data could not be located. It may have been deleted or relocated. Please verify the information or try a different request.",
		statusCode: 404
	});
};

export default notFound;
