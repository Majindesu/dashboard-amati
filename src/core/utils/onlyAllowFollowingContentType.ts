import { headers } from "next/headers";
import BaseError from "../error/BaseError";

/**
 * Ensures that the current request's content type is one of the allowed types.
 * This function is intended to be used in Next.js API routes to validate request content types.
 *
 * @param contentTypes - A single content type string or an array of allowed content type strings.
 * @throws {BaseError} Throws a BaseError if the current request's content type is not in the allowed content types.
 */
export default function onlyAllowFollowingContentType(
	contentTypes: string | string[]
) {
	// Retrieve the current request's content type.
	const currentContentType = headers().get("Content-Type");

	// Normalize the input parameter to an array to simplify the inclusion check.
	const allowedContentTypes = Array.isArray(contentTypes)
		? contentTypes
		: [contentTypes];

	// Check if the current content type is not among the allowed ones and throw an error if so.
	if (!allowedContentTypes.includes(currentContentType ?? "")) {
		throw new BaseError({
			errorCode: "UNSUPPORTED_CONTENT_TYPE",
			message:
				"This content type is not supported. Please use one of the supported content types instead.",
			statusCode: 400,
		});
	}
}
