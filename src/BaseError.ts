export enum BaseErrorCodes {
    INVALID_FORM_DATA = "INVALID_FORM_DATA",
    UNAUTHORIZED = "UNAUTHORIZED",
}

export default class BaseError extends Error {
    public readonly errorCode: string;
    public readonly statusCode: number;
    public readonly data: object;

    constructor(message: string = "An unexpected error occurred", errorCode: string = "GENERIC_ERROR", statusCode: number = 500, data: object = {}) {
        super(message); // Pass message to the Error parent class
        this.errorCode = errorCode;
        this.statusCode = statusCode;
        this.data = data;
        Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
    }

    getErrorReponseObject(){
        return {
            success: false,
            error: {
                message: this.message,
                errorCode: this.errorCode,
            }
        } as const
    }
}

export const unauthorized = () => {
    throw new BaseError("Unauthorized", BaseErrorCodes.UNAUTHORIZED)
}