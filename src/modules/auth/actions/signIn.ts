"use server";
import prisma from "@/core/db";
import { User } from "@prisma/client";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import AuthError from "../error/AuthError";
import comparePassword from "../utils/comparePassword";
import { createJwtToken } from "../utils/createJwtToken";

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
 * @throws Specific authentication error based on the failure stage.
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
		if (!user)
			throw new AuthError({
				errorCode: "EMAIL_NOT_FOUND",
				message: "Email or Password does not match",
			});

		// Throw if user has no password hash
		// TODO: Add check if the user uses another provider
		if (!user.passwordHash)
			throw new AuthError({ errorCode: "EMPTY_USER_HASH" });

		// Compare the provided password with the user's stored password hash
		const isMatch = await comparePassword(
			formData.password,
			user.passwordHash
		);
		if (!isMatch)
			throw new AuthError({
				errorCode: "INVALID_CREDENTIALS",
				message: "Email or Password does not match",
			});

		//Set cookie
		//TODO: Auth: Add expiry
		const token = createJwtToken({ id: user.id });

		cookies().set("token", token);
	} catch (e: unknown) {
		// Custom error handling for authentication errors
		if (e instanceof AuthError) {
			// Specific error handling for known authentication errors
			switch (e.errorCode) {
				case "EMAIL_NOT_FOUND":
				case "INVALID_CREDENTIALS":
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
