import DashboardError from "@/modules/dashboard/errors/DashboardError";

export const ResellerOffice365ErrorCodes = [
	"REQUEST_IS_NOT_IN_WAITING_STATE"
] as const;

interface ResellerOffice365ErrorOptions {
	message?: string;
	errorCode: (typeof ResellerOffice365ErrorCodes)[number] | (string & {});
	formErrors?: Record<string, string>
}

export default class ResellerOffice365Error extends DashboardError {
	public readonly errorCode: ResellerOffice365ErrorOptions['errorCode'];
	public readonly formErrors?: ResellerOffice365ErrorOptions['formErrors']

	constructor(options: ResellerOffice365ErrorOptions) {
		super({
			errorCode: options.errorCode,
			message: options.message,
		});

		this.errorCode = options.errorCode;
    }
}
