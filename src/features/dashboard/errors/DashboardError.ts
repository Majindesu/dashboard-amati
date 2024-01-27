import { Prisma } from "@prisma/client";

export const DashboardErrorCodes = [
    "UNAUTHORIZED",
    "NOT_FOUND",
    "UNKNOWN_ERROR",
    "INVALID_FORM_DATA",
] as const;

interface ErrorOptions {
    message?: string,
    errorCode?: typeof DashboardErrorCodes[number] | string & {},
    formErrors?: {[k: string]: string}
}

export default class DashboardError extends Error {
    public readonly errorCode: typeof DashboardErrorCodes[number] | string & {};
    public readonly formErrors?: {[k: string]: string}
    // public readonly data: object;

    constructor(options: ErrorOptions) {
        super(options.message ?? "Undetermined Error"); // Pass message to the Error parent class
        this.errorCode = options.errorCode ?? "UNKNOWN_ERROR";
        this.formErrors = options.formErrors;
        // this.data = data;
        Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
    }

    getErrorReponseObject(){
        return {
            success: false,
            dashboardError: true,
            error: {
                message: `${this.message}`,
                errorCode: this.errorCode,
                errors: this.formErrors ?? undefined
            }
        } as const
    }
}

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

export const unauthorized = () => {
    throw new DashboardError({
        errorCode: "UNAUTHORIZED",
        message: "You are unauthorized to do this action"
    })
}