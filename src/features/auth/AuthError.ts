import BaseError from "@/BaseError";

export enum AuthErrorCode {
    EMAIL_NOT_FOUND = "EMAIL_NOT_FOUND",
    EMPTY_USER_HASH = "EMPTY_USER_HASH",
    INVALID_CREDENTIALS = "INVALID_CREDENTIALS",
    JWT_SECRET_EMPTY = "JWT_SECRET_NOT_EMPTY",
    USER_ALREADY_EXISTS = "USER_ALREADY_EXISTS",
}

export default class AuthError extends BaseError {
    constructor(errorCode: AuthErrorCode, statusCode = 500, message: string = "Authentication error") {
        super(message, errorCode, statusCode);
    }
}
