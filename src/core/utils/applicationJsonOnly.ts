import BaseError from "../error/BaseError";

export default function applicationJsonOnly(headers: Headers) {
	if (headers.get("Content-Type") !== "application/json")
		throw new BaseError({
			errorCode: "UNSUPPORTED_CONTENT_TYPE",
			message:
				"This content type is not supported. Please use application/json instead",
			statusCode: 400,
		});
}
