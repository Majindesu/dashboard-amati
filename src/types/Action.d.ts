export type ErrorResponse = {
	success: false;
	dashboardError?: boolean;
	error?: {
		message?: string;
		errorCode?: string;
		errors?: { [k: string]: string };
	};
	message?: string;
}

export type SuccessResponse<T = undefined> = T extends undefined ? {success: true; message?: string} : {
	success: true;
	message?: string;
	data: T;
}

type ServerResponse<T = undefined> =
	| ErrorResponse
	| SuccessResponse<T>

export default ServerResponse;
