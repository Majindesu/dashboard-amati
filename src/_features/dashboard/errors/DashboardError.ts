import { Prisma } from "@prisma/client";

// Use TypeScript enum for error codes to provide better autocompletion and error handling
export const DashboardErrorCodes = [
    "UNAUTHORIZED",
    "NOT_FOUND",
    "UNKNOWN_ERROR",
    "INVALID_FORM_DATA",
] as const;

interface ErrorOptions {
    message?: string,
    errorCode?: typeof DashboardErrorCodes[number] | string & {},
    formErrors?: Record<string, string>
}

/**
 * Custom error class for handling errors specific to the dashboard application.
 */
export default class DashboardError extends Error {
    public readonly errorCode: typeof DashboardErrorCodes[number] | string & {};
    public readonly formErrors?: Record<string, string>

    constructor(options: ErrorOptions) {
        super(options.message ?? "Undetermined Error"); // Pass message to the Error parent class
        this.errorCode = options.errorCode ?? "UNKNOWN_ERROR";
        this.formErrors = options.formErrors;
        Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
    }

    /**
     * Returns a structured error response object.
     */
    getErrorReponseObject(){
        return {
            success: false,
            dashboardError: true,
            error: {
                message: `${this.message}`,
                errorCode: this.errorCode,
                errors: this.formErrors ?? undefined
            }
        } as const;
    }
}
