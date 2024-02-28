import BaseError from "@/core/error/BaseError";

export const AuthErrorCodes = [
	"EMAIL_NOT_FOUND",
	"EMPTY_USER_HASH",
	"INVALID_CREDENTIALS",
	"INVALID_JWT_TOKEN",
	"JWT_SECRET_EMPTY",
	"USER_ALREADY_EXISTS",
	"ALREADY_LOGGED_IN"
] as const;

interface AuthErrorOptions {
	message?: string;
	errorCode: (typeof AuthErrorCodes)[number] | (string & {});
	statusCode?: number;
}

export default class AuthError extends BaseError {
	errorCode: (typeof AuthErrorCodes)[number] | (string & {});

	constructor(options: AuthErrorOptions) {
		super({
			errorCode: options.errorCode,
			message: options.message,
			statusCode: options.statusCode,
		});

		this.errorCode = options.errorCode;
	}
}
