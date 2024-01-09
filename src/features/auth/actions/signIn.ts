import prisma from "@/db";
import { User } from "@prisma/client";
import AuthError, { AuthErrorCode } from "../AuthError";
import { comparePassword } from "../authUtils";

/**
 * Validates the user by their email and password.
 * If the user is found and the password is correct, it returns the user.
 * Throws an AuthError if any authentication step fails.
 * 
 * @param email - The email of the user to validate.
 * @param password - The password to validate against the user's stored hash.
 * @returns The authenticated user object.
 * @throws {AuthError} - EMAIL_NOT_FOUND if no user is found, INVALID_CREDENTIALS if the password doesn't match, or other auth-related errors.
 */
export default async function signIn(email: string, password: string): Promise<User> {
    // Retrieve user from the database by email
    const user = await prisma.user.findUnique({
        where: { email }
    });

    // Throw if user not found
    if (!user) throw new AuthError(AuthErrorCode.EMAIL_NOT_FOUND, 401);

    // Throw if user has no password hash
    // TODO: Add check if the user uses another provider
    if (!user.passwordHash) throw new AuthError(AuthErrorCode.EMPTY_USER_HASH, 500);
    
    // Compare the provided password with the user's stored password hash
    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) throw new AuthError(AuthErrorCode.INVALID_CREDENTIALS, 401);

    return user;
}
