import {
	CreateUserSchema,
	createUserSchema,
} from "../formSchemas/CreateUserFormSchema";
import mapObjectToFirstValue from "@/utils/mapObjectToFirstValue";
import db from "@/core/db";
import AuthError from "../error/AuthError";
import hashPassword from "../utils/hashPassword";
import { createJwtToken } from "../utils/createJwtToken";
import BaseError from "@/core/error/BaseError";

/**
 * Creates a new user in the database after validating the input data.
 * It throws errors if the input data is invalid or if the user already exists.
 * On successful creation, it returns a token for the created user.
 *
 * @param userData - The user data to create a new user. Must conform to CreateUserSchema.
 * @returns  An object containing the JWT token for the newly created user.
 * @throws If the input validation fails.
 * @throws If the user already exists in the database.
 */
export default async function createUser(userData: CreateUserSchema) {
	const validatedFields = createUserSchema.safeParse(userData);

	//Validate form input
	if (!validatedFields.success) {
		throw new BaseError({
			errorCode: "INVALID_FORM_DATA",
			formErrors: mapObjectToFirstValue(
				validatedFields.error.flatten().fieldErrors
			),
			statusCode: 422,
		});
	}

	//Check email exists
	if (
		await db.user.findFirst({
			where: { email: validatedFields.data.email },
		})
	) {
		throw new AuthError({
			errorCode: "USER_ALREADY_EXISTS",
			message: "This email already exists",
			statusCode: 422,
		});
	}

	//Create user
	const user = await db.user.create({
		data: {
			name: validatedFields.data.name,
			email: validatedFields.data.email,
			passwordHash: await hashPassword(validatedFields.data.password),
		},
	});

	//Set token
	const token = createJwtToken({ id: user.id });

	return {
		token,
		user: {
			name: user.name,
			email: user.email,
			profilePhotoUrl: user.photoProfile,
		},
	};
}
