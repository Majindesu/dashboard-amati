import prisma from "@/db";
import { User } from "@prisma/client";
import * as bcrypt from "bcrypt";
import AuthError, { AuthErrorCode } from "./AuthError";
import authConfig from "@/config/auth";

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
export async function validateUser(email: string, password: string): Promise<User> {
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

/**
 * Hashes a plain text password using bcrypt.
 * 
 * @param password - The plain text password to hash.
 * @returns The hashed password.
 */
export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, authConfig.saltRounds);
}

/**
 * Compares a plain text password with a hashed password.
 * 
 * @param password - The plain text password to compare.
 * @param hash - The hashed password to compare against.
 * @returns True if the passwords match, false otherwise.
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
}
