"use server";

import "server-only";
import AuthError from "../error/AuthError";
import getMyDetail from "../services/getMyDetail";
import ServerResponseAction from "@/modules/dashboard/types/ServerResponseAction";
import handleCatch from "@/modules/dashboard/utils/handleCatch";
import BaseError from "@/core/error/BaseError";

/**
 * Retrieves the user details based on the JWT token from cookies.
 * This function is designed to be used in a server-side context within a Next.js application.
 * It attempts to parse the user's token, fetch the user's details, and format the response.
 * If the token is invalid or the user cannot be found, it gracefully handles these cases.
 *
 * @returns A promise that resolves to the user's details object or null if the user cannot be authenticated or an error occurs.
 * @throws an error if an unexpected error occurs during execution.
 */
export default async function getMyDetailAction(): Promise<
	ServerResponseAction<Awaited<ReturnType<typeof getMyDetail>>>
> {
	try {
		return {
			success: true,
			data: await getMyDetail(),
		};
	} catch (e: unknown) {
		if (
			e instanceof AuthError &&
			["INVALID_JWT_TOKEN"].includes(e.errorCode)
		) {
			return {
				success: false,
				error: new BaseError({
					errorCode: e.errorCode,
					message: "You are not authenticated",
				}),
			};
		}
		return handleCatch(e);
	}
}
