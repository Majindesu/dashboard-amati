"use server";

import getMyDetail from "../services/getMyDetail";
import AuthError from "../error/AuthError";
import BaseError from "@/core/error/BaseError";
import ServerResponseAction from "@/modules/dashboard/types/ServerResponseAction";
import handleCatch from "@/modules/dashboard/utils/handleCatch";
import "server-only";

/**
 * Asynchronously retrieves the authenticated user's details from a server-side context in a Next.js application.
 * This function uses a JWT token obtained from cookies to authenticate the user and fetch their details.
 * If the authentication fails due to an invalid JWT token, or if any other error occurs, the function handles these errors gracefully.
 *
 * @returns  A promise that resolves to a `ServerResponseAction` object. This object includes a `success` flag indicating the operation's outcome, the user's details in the `data` field if successful, or an error object in the `error` field if an error occurs.
 * @throws an unhandled error if an unexpected error occurs during the function execution.
 */
export default async function getMyDetailAction(): Promise<ServerResponseAction<Awaited<ReturnType<typeof getMyDetail>>>> {
	try {
		// Attempt to fetch and return the user's details.
		const userDetails = await getMyDetail();
		return {
			success: true,
			data: userDetails,
		};
	} catch (e: unknown) {
		// Check if the error is an instance of AuthError and handle it.
		if (e instanceof AuthError && e.errorCode === "INVALID_JWT_TOKEN") {
			return {
				success: false,
				error: new BaseError({
					errorCode: e.errorCode,
					message: "You are not authenticated",
				}),
			};
		}
		// Handle other types of errors.
		return handleCatch(e);
	}
}
