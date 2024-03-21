import BaseError from "@/core/error/BaseError";

export const FileErrorCodes = [
	"INVALID_IMAGE_FORMAT",
	"IMAGE_TOO_LARGE",
] as const;

interface FileErrorOptions {
	message?: string;
	errorCode: (typeof FileErrorCodes)[number] | (string & {});
	statusCode?: number;
}

export default class FileError extends BaseError {
	errorCode: (typeof FileErrorCodes)[number] | (string & {});

	constructor(options: FileErrorOptions) {
		super({
			errorCode: options.errorCode,
			message: options.message,
			statusCode: options.statusCode,
		});

		this.errorCode = options.errorCode;
	}
}
