import BaseError from "@/BaseError";

export enum AuthErrorCode {
    EMAIL_NOT_FOUND = "EMAIL_NOT_FOUND",
    EMPTY_USER_HASH = "EMPTY_USER_HASH",
    INVALID_CREDENTIALS = "INVALID_CREDENTIALS",
    INVALID_JWT_TOKEN = "INVALID_JWT_TOKEN",
    JWT_SECRET_EMPTY = "JWT_SECRET_NOT_EMPTY",
    USER_ALREADY_EXISTS = "USER_ALREADY_EXISTS",
}

export default class AuthError extends BaseError {
    constructor(errorCode: AuthErrorCode, {statusCode = 500, message, data}: Partial<{statusCode: number, message: string, data: object}> = {}) {
        super(message, errorCode, statusCode, data);
    }
}
