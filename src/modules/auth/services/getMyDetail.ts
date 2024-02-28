import { cookies } from "next/headers";
import getUserFromToken from "../utils/getUserFromToken";
import AuthError from "../error/AuthError";

/**
 * Retrieves the details of the currently authenticated user based on the JWT token.
 * If the token is not present or the user cannot be found, it returns null.
 * Otherwise, it returns the user's name, email, and photo URL.
 *
 * @returns An object containing the user's name, email, and photo URL, or null if the user cannot be authenticated.
 */
export default async function getMyDetail(token?: string) {
	if (!token)
		throw new AuthError({
			errorCode: "INVALID_JWT_TOKEN",
			message: "You are not authenticated",
		});

	const user = await getUserFromToken(token);

	// Return null if user is not found
	if (!user) return null;

	// Return user details
	return {
		name: user.name ?? "",
		email: user.email ?? "",
		photoUrl: user.photoProfile ?? null,
	};
}
