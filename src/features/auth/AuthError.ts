import BaseError from "@/BaseError";

export enum AuthErrorCode {
    EMAIL_NOT_FOUND = "EMAIL_NOT_FOUND",
    INVALID_CREDENTIALS = "INVALID_CREDENTIALS",
    EMPTY_USER_HASH = "EMPTY_USER_HASH"
}

export default class AuthError extends BaseError {
    constructor(errorCode: AuthErrorCode, statusCode = 500, message: string = "Authentication error") {
        super(message, errorCode, statusCode);
    }
}
