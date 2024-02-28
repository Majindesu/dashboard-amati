import "client-only"
export const ClientErrorCodes = ["UNKNOWN_ERROR", "UNSUPPORTED_CONTENT_TYPE"] as const;

interface ErrorOptions {
	message?: string;
	errorCode: (typeof ClientErrorCodes)[number] | (string & {});
	statusCode?: number
    formErrors?: Record<string, string>
}

class ClientError extends Error {
	public readonly errorCode: ErrorOptions['errorCode'];
	public readonly statusCode: ErrorOptions['statusCode'];
    public readonly formErrors?: ErrorOptions['formErrors']

	constructor(options: ErrorOptions) {
		super(options.message ?? "Undetermined Error");
		this.errorCode = options.errorCode ?? "UNKNOWN_ERROR";
		this.statusCode = options.statusCode ?? 500;
        this.formErrors = options.formErrors;

		Object.setPrototypeOf(this, new.target.prototype);
	}

	getActionResponseObject() {
		return {
			success: false,
			error: {
				message: this.message,
				errorCode: this.errorCode,
			},
		} as const;
	}

	getRestApiResponseObject(){
		return {
			message: this.message,
			errorCode: this.errorCode
		}
	}
}

export default ClientError;
