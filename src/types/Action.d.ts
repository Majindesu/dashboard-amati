type ServerResponse<T = undefined> =
	| {
			success: false;
			dashboardError?: boolean;
			error?: {
				message?: string;
				errorCode?: string;
				errors?: { [k: string]: string };
			};
			message?: string;
	  }
	| {
			success: true;
			message?: string;
			data?: T;
	  };

export default ServerResponse;
