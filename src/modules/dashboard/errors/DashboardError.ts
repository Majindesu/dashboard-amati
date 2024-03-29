import BaseError from "@/core/error/BaseError";

export const DashboardErrorCodes = [
	"EMAIL_NOT_FOUND",
	"EMPTY_USER_HASH",
	"INVALID_CREDENTIALS",
	"INVALID_JWT_TOKEN",
	"JWT_SECRET_EMPTY",
	"USER_ALREADY_EXISTS",
	"INVALID_FORM_DATA"
] as const;

interface DashboardErrorOptions {
	message?: string;
	errorCode: (typeof DashboardErrorCodes)[number] | (string & {});
	formErrors?: Record<string, string>
	statusCode?: number;
}

export default class DashboardError extends BaseError {
	public readonly errorCode: DashboardErrorOptions['errorCode'];
	public readonly formErrors?: DashboardErrorOptions['formErrors']

	constructor(options: DashboardErrorOptions) {
		super({
			errorCode: options.errorCode,
			message: options.message,
			statusCode: options.statusCode,
		});

		this.errorCode = options.errorCode;
	}

	/**
     * Returns a structured error response object.
     */
    getErrorReponseObject(){
        return {
            success: false,
            dashboardError: true,
            error: {
                message: `${this.message}`,
                errorCode: this.errorCode,
                errors: this.formErrors ?? undefined
            }
        } as const;
    }
}
