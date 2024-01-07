export default class BaseError extends Error {
    public readonly errorCode: string;
    public readonly statusCode: number;

    constructor(message: string = "An unexpected error occurred", errorCode: string = "GENERIC_ERROR", statusCode: number = 500) {
        super(message); // Pass message to the Error parent class
        this.errorCode = errorCode;
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
    }
}
