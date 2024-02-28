import {z} from "zod"

/**
 * Interface for the schema of a new user.
 */
export interface CreateUserSchema {
	name: string;
	email: string;
	password: string;
    passwordConfirmation: string;
}

export const createUserSchema = z
	.object({
		name: z.string(),
		email: z.string().email(),
		password: z.string().min(6),
		passwordConfirmation: z.string().optional(),
	})
	.refine((data) => data.password === data.passwordConfirmation, {
		message: "Password confirmation must match the password",
		path: ["passwordConfirmation"],
	});