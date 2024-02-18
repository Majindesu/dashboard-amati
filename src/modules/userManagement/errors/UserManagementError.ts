import DashboardError from "@/modules/dashboard/errors/DashboardError";

export const UserManagementErrorCodes = [
	"CANNOT_DELETE_SELF"
] as const;

interface UserManagementErrorOptions {
	message?: string;
	errorCode: (typeof UserManagementErrorCodes)[number] | (string & {});
	formErrors?: Record<string, string>
}

export default class UserManagementError extends DashboardError {
	public readonly errorCode: UserManagementErrorOptions['errorCode'];
	public readonly formErrors?: UserManagementErrorOptions['formErrors']

	constructor(options: UserManagementErrorOptions) {
		super({
			errorCode: options.errorCode,
			message: options.message,
		});

		this.errorCode = options.errorCode;
    }
}