"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AuthError from "../error/AuthError";
import signIn from "../services/signIn";

/**
 * Asynchronously handles the sign-in process for a user by validating their credentials against the database.
 * Upon successful validation, the user is redirected to the dashboard, and a JWT token is set as a cookie.
 * If validation fails, a custom `AuthError` is thrown, and detailed error information is provided to the caller.
 * 
 * Note: Future enhancements should include throttling to prevent brute force attacks and a check to prevent
 * sign-in attempts if the user is already logged in.
 * 
 * @param prevState - The previous state of the application. Currently not utilized but may be used for future enhancements.
 * @param rawFormData - The raw form data obtained from the sign-in form, containing the user's email and password.
 * @returns A promise that, upon successful authentication, resolves to a redirection to the dashboard. If authentication fails,
 *          it resolves to an object containing error details.
 * @throws {AuthError} - Throws a custom `AuthError` with specific error codes for different stages of the authentication failure.
 */
export default async function signInAction(prevState: any, rawFormData: FormData) {
	//TODO: Add Throttling
	//TODO: Add validation check if the user is already logged in
	try {
		// Extract email and password from the raw form data.
		const formData = {
			email: rawFormData.get("email") as string,
			password: rawFormData.get("password") as string,
		};

		// Attempt to sign in with the provided credentials.
		const result = await signIn(formData)

		// Set the JWT token in cookies upon successful sign-in.
		cookies().set("token", result.token);

		// Redirect to the dashboard after successful sign-in.
		redirect("/dashboard");
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
}
