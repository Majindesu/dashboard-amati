import BaseError from "@/core/error/BaseError";

export const AuthErrorCodes = [
	"EMAIL_NOT_FOUND",
	"EMPTY_USER_HASH",
	"INVALID_CREDENTIALS",
	"INVALID_JWT_TOKEN",
	"JWT_SECRET_EMPTY",
	"USER_ALREADY_EXISTS",
] as const;

interface AuthErrorOptions {
	message?: string;
	errorCode: (typeof AuthErrorCodes)[number] | (string & {});
}

export default class AuthError extends BaseError {
	errorCode: (typeof AuthErrorCodes)[number] | (string & {});

	constructor(options: AuthErrorOptions) {
		super({
			errorCode: options.errorCode,
			message: options.message,
		});

		this.errorCode = options.errorCode;
	}
}
