import DashboardError from "../errors/DashboardError";

/**
 * Throws a 'UNAUTHORIZED' DashboardError.
 */
const unauthorized = () => {
	throw new DashboardError({
		errorCode: "UNAUTHORIZED",
		message: "You are unauthorized to do this action",
	});
};

export default unauthorized;
