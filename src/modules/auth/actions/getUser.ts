"use server";

import { cookies } from "next/headers";
import "server-only";
import getUserFromToken from "../utils/getUserFromToken";
import AuthError from "../error/AuthError";

/**
 * Retrieves the user details based on the JWT token from cookies.
 * This function is designed to be used in a server-side context within a Next.js application.
 * It attempts to parse the user's token, fetch the user's details, and format the response.
 * If the token is invalid or the user cannot be found, it gracefully handles these cases.
 *
 * @returns A promise that resolves to the user's details object or null if the user cannot be authenticated or an error occurs.
 * @throws an error if an unexpected error occurs during execution.
 */
export default async function getUser() {
	try {
		const token = cookies().get("token");

		if (!token) return null;

		const user = await getUserFromToken(token.value);

		if (!user) return null;

		return {
			name: user.name ?? "",
			email: user.email ?? "",
			photoUrl: user.photoProfile ?? null,
		};
	} catch (e: unknown) {
		// Handle specific authentication errors gracefully
		if (e instanceof AuthError && e.errorCode === "INVALID_JWT_TOKEN") {
			return null;
		}
		throw e;
	}
}
