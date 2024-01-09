import CredentialsProvider from "next-auth/providers/credentials"
import AuthError, { AuthErrorCode } from "../AuthError";
import BaseError from "@/BaseError";
import signIn from "../actions/signIn";

/**
 * Factory function to create a credential provider.
 * It defines the structure of the credentials and includes an authorization function
 * to validate the user's credentials.
 * 
 * @returns A CredentialsProvider instance configured for email-password authentication.
 */
const credential = CredentialsProvider({
    name: "email-password",
    credentials: {
        email: {
            label: "Email",
            type: "email",
        },
        password: {
            label: "password",
            type: "password"
        }
    },
    authorize: async (credentials) => {
        try {
            // Ensure credentials are properly formatted strings
            if (typeof credentials.email !== "string" || typeof credentials.password !== "string"){
                throw new AuthError(AuthErrorCode.INVALID_CREDENTIALS, 401);
            }

            // Validate user with provided credentials
            const user = await signIn(credentials.email, credentials.password);
            return user;
        } catch (e: unknown){
            // Handle specific authentication errors, re-throw others
            if (e instanceof AuthError){
                // Auth invalid
                if ([AuthErrorCode.EMAIL_NOT_FOUND, AuthErrorCode.EMPTY_USER_HASH, AuthErrorCode.INVALID_CREDENTIALS].includes(e.errorCode as AuthErrorCode))
                    return null;
            }
            throw e;
        }
    },
})

export default credential;