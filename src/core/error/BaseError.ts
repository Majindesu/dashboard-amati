import logger from "../logger/Logger";

export const BaseErrorCodes = ["UNKNOWN_ERROR", "UNSUPPORTED_CONTENT_TYPE", "INVALID_FORM_DATA"] as const;

interface ErrorOptions {
	message?: string;
	errorCode: (typeof BaseErrorCodes)[number] | (string & {});
	statusCode?: number,
	formErrors?: Record<string, string>
}

class BaseError extends Error {
	public readonly errorCode: (typeof BaseErrorCodes)[number] | (string & {});
	public readonly statusCode: number;
	public readonly formErrors?: ErrorOptions['formErrors'];

	constructor(options: ErrorOptions) {
		super(options.message ?? "Undetermined Error");
		this.errorCode = options.errorCode ?? "UNKNOWN_ERROR";
		this.statusCode = options.statusCode ?? 500;
		this.formErrors = options.formErrors;

		Object.setPrototypeOf(this, new.target.prototype);

		this.saveToLog();
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

	saveToLog() {
		const excludedErrorCodes: string[] = [];

		if (excludedErrorCodes.includes(this.errorCode)) {
			return;
		}

		logger.error(JSON.stringify({errorCode: this.errorCode, message: this.message, stack: this.stack}))
	}
}

export default BaseError;
