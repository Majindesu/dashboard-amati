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

/**
 * Handles exceptions and converts them into a structured error response.
 * @param e The caught error or exception.
 */
export const handleCatch = (e: unknown) => {
    if (e instanceof DashboardError){
        return e.getErrorReponseObject()
    }
    if (e instanceof Prisma.PrismaClientKnownRequestError){
        //Not found
        if (e.code === "P2025"){
            const error = new DashboardError({errorCode: "NOT_FOUND", message: "The requested data could not be located. It may have been deleted or relocated. Please verify the information or try a different request."})
            return error.getErrorReponseObject()
        }
    }
    if (e instanceof Error) {
        return {
            success: false,
            dashboardError: false,
            message: e.message
        } as const;
    } else {
        return {
            success: false,
            dashboardError: false,
            message: "Unkown error"
        } as const
    }
}

/**
 * Throws a 'UNAUTHORIZED' DashboardError.
 */
export const unauthorized = () => {
    throw new DashboardError({
        errorCode: "UNAUTHORIZED",
        message: "You are unauthorized to do this action"
    })
}

/**
 * Throws a 'NOT_FOUND' DashboardError with a custom or default message.
 * @param message Optional custom message for the error.
 */
export const notFound = ({message}: {message?: string}) => {
    throw new DashboardError({
        errorCode: "NOT_FOUND",
        message: message ?? "The requested data could not be located. It may have been deleted or relocated. Please verify the information or try a different request."
    })
}