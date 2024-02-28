import "server-only";
import SignInFormData from "../types/SignInFormData";
import db from "@/core/db";
import AuthError from "../error/AuthError";
import comparePassword from "../utils/comparePassword";
import { createJwtToken } from "../utils/createJwtToken";

/**
 * Authenticates a user with email and password credentials.
 *
 * This function looks up the user in the database by email. If the user exists and the password matches
 * the hashed password in the database, a JWT token is created and returned. If any step of this process fails,
 * an `AuthError` with a specific error code and message is thrown.
 *
 * @param rawCredential - Contains the email and password provided by the user.
 * @returns An object containing a JWT token if authentication is successful.
 * @throws {AuthError} - Throws an `AuthError` with an appropriate error code and message for various failure scenarios.
 */
export default async function signIn(rawCredential: SignInFormData) {
	const user = await db.user.findUnique({
		where: { email: rawCredential.email },
	});

	if (!user)
		throw new AuthError({
			errorCode: "EMAIL_NOT_FOUND",
			message: "Email or Password does not match",
		});

	//TODO: Add handle for empty password hash
	// Ensure there is a password hash to compare against.
	if (!user.passwordHash)
		throw new AuthError({
			errorCode: "EMPTY_USER_HASH",
			message: "Something wrong. Please contact your administrator",
		});

	// Compare the provided password with the stored hash.
	const isMatch = await comparePassword(
		rawCredential.password,
		user.passwordHash
	);

	// Create a JWT token upon successful authentication.
	if (!isMatch)
		throw new AuthError({
			errorCode: "INVALID_CREDENTIALS",
			message: "Email or Password does not match",
		});

	const token = createJwtToken({ id: user.id });

	return { token };
}
