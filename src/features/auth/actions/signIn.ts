"use server";
import prisma from "@/db";
import { User } from "@prisma/client";
import AuthError, { AuthErrorCode } from "../AuthError";
import { comparePassword, createJwtToken } from "../authUtils";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import BaseError from "@/BaseError";
import { revalidatePath } from "next/cache";

/**
 * Handles the sign-in process for a user.
 *
 * This function validates a user's credentials (email and password), checks against the database,
 * and on successful validation, redirects the user to the dashboard and sets a cookie with a JWT token.
 * If the validation fails at any stage, it throws a custom AuthError.
 *
 * @param prevState - The previous state of the application, not currently used.
 * @param rawFormData - The raw form data containing the user's email and password.
 * @returns A promise that resolves to a redirect to the dashboard on successful authentication,
 *          or an object containing error details on failure.
 * @throws {AuthError} - Specific authentication error based on the failure stage.
 */
export default async function signIn(prevState: any, rawFormData: FormData) {
	//TODO: Add Throttling
	//TODO: Add validation check if the user is already logged in
	try {
		const formData = {
			email: rawFormData.get("email") as string,
			password: rawFormData.get("password") as string,
		};

		// Retrieve user from the database by email
		const user = await prisma.user.findUnique({
			where: { email: formData.email },
		});

		// Throw if user not found
		if (!user) throw new AuthError(AuthErrorCode.EMAIL_NOT_FOUND);

		// Throw if user has no password hash
		// TODO: Add check if the user uses another provider
		if (!user.passwordHash)
			throw new AuthError(AuthErrorCode.EMPTY_USER_HASH);

		// Compare the provided password with the user's stored password hash
		const isMatch = await comparePassword(
			formData.password,
			user.passwordHash
		);
		if (!isMatch) throw new AuthError(AuthErrorCode.INVALID_CREDENTIALS);

		//Set cookie
		//TODO: Auth: Add expiry
		const token = createJwtToken({ id: user.id });

		cookies().set("token", token);
	} catch (e: unknown) {
		// Custom error handling for authentication errors
		if (e instanceof BaseError) {
			// Specific error handling for known authentication errors
			switch (e.errorCode) {
				case AuthErrorCode.EMAIL_NOT_FOUND:
				case AuthErrorCode.INVALID_CREDENTIALS:
					return {
						errors: {
							message:
								"Email/Password combination is incorrect. Please try again.",
						},
					};
				default:
					// Handle other types of authentication errors
					return {
						errors: {
							message: e.message,
						},
					};
			}
		}

		// Generic error handling for unexpected server errors
		return {
			errors: {
				message:
					"An unexpected error occurred on the server. Please try again or contact the administrator.",
			},
		};
	}

	redirect("/dashboard");
}
