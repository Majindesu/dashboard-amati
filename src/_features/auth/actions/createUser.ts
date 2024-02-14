"use server"
import { z } from "zod";
import prisma from "@/db";
import AuthError, { AuthErrorCode } from "../AuthError";
import BaseError, { BaseErrorCodes } from "@/BaseError";
import { createJwtToken, hashPassword } from "../authUtils";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Interface for the schema of a new user.
 */
interface CreateUserSchema {
    name: string;
    email: string;
    password: string;
}

/**
 * Validation schema for creating a user.
 */
const createUserSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
    passwordConfirmation: z.string().optional(),
}).refine(
    (data) => data.password === data.passwordConfirmation,
    {
        message: "Password confirmation must match the password",
        path: ["passwordConfirmation"],
    }
);

/**
 * Creates a new user in the system.
 * 
 * @param formData - The form data containing user details.
 * @returns An object indicating the result of the operation.
 */
export default async function createUser(formData: FormData){
    //TODO: Add Throttling
    //TODO: Add validation check if the user is already logged in

    try {
        const parsedData = {
            email: formData.get("email")?.toString() ?? '',
            name: formData.get("name")?.toString() ?? '',
            password: formData.get("password")?.toString() ?? '',
            passwordConfirmation: formData.get("passwordConfirmation")?.toString()
        };
        const validatedFields = createUserSchema.safeParse(parsedData);

        if (!validatedFields.success) {
            return {
                success: false,
                error: {
                    message: "",
                    errors: validatedFields.error.flatten().fieldErrors
                }
            }
        }

        const existingUser = await prisma.user.findUnique({
            where: { email: validatedFields.data.email },
        });

        if (existingUser){
            return {
                success: false,
                error: {
                    message: "",
                    errors: {
                        email: ["Email already exists"]
                    }
                }
            }
        }

        const user = await prisma.user.create({
            data: {
                name: validatedFields.data.name,
                email: validatedFields.data.email,
                passwordHash: await hashPassword(validatedFields.data.password),
            },
        });

        const token = createJwtToken({ id: user.id });
        cookies().set("token", token);
    } catch (e: unknown) {    
        // Handle unexpected errors
        console.error(e)
        //@ts-ignore
        console.log(e.message)
        return {
            success: false,
            error: {
                message: "An unexpected error occurred on the server. Please try again or contact the administrator.",
            },
        };
    }

    redirect("/dashboard");
}
