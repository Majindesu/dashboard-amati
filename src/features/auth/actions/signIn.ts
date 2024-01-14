"use server"
import prisma from "@/db";
import { User } from "@prisma/client";
import AuthError, { AuthErrorCode } from "../AuthError";
import { comparePassword, createJwtToken } from "../authUtils";
import { cookies } from "next/headers";
import { redirect } from 'next/navigation';

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
export default async function signIn(prevState: any, rawFormData: FormData) {
    //TODO: Add Throttling
    try {
        const formData = {
            email: rawFormData.get("email") as string,
            password: rawFormData.get("password") as string
        }

        // Retrieve user from the database by email
        const user = await prisma.user.findUnique({
            where: { email: formData.email }
        });

        // Throw if user not found
        if (!user) throw new AuthError(AuthErrorCode.EMAIL_NOT_FOUND, 401);

        // Throw if user has no password hash
        // TODO: Add check if the user uses another provider
        if (!user.passwordHash) throw new AuthError(AuthErrorCode.EMPTY_USER_HASH, 500);
        
        // Compare the provided password with the user's stored password hash
        const isMatch = await comparePassword(formData.password, user.passwordHash);
        if (!isMatch) throw new AuthError(AuthErrorCode.INVALID_CREDENTIALS, 401);

        //Set cookie
        //TODO: Auth: Add expiry
        const token = createJwtToken({id: user.id});

        cookies().set("token",token);

        redirect("/dashboard");

    } catch (e: unknown){
        if (e instanceof AuthError){
            if ([
                AuthErrorCode.EMAIL_NOT_FOUND, AuthErrorCode.INVALID_CREDENTIALS
            ]) {
                return {
                    errors: {
                        message: "Email/Password combination is not match. Please try again"
                    }
                }
            }
        }

        return {
            errors: {
                message: "There's something wrong happened on the server. Please try again or contact administrator"
            }
        }
    }
}
