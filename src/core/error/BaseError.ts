export const BaseErrorCodes = ["UNKOWN_ERROR"] as const;

interface ErrorOptions {
	message?: string;
	errorCode: (typeof BaseErrorCodes)[number] | (string & {});
}

class BaseError extends Error {
	public readonly errorCode: (typeof BaseErrorCodes)[number] | (string & {});

	constructor(options: ErrorOptions) {
		super(options.message ?? "Undetermined Error");
		this.errorCode = options.errorCode ?? "UNKOWN_ERROR";

		Object.setPrototypeOf(this, new.target.prototype);

		console.error("error:", options)
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
}

export default BaseError;
