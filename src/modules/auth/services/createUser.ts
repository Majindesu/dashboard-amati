import DashboardError from "@/modules/dashboard/errors/DashboardError";
import {
	CreateUserSchema,
	createUserSchema,
} from "../formSchemas/CreateUserFormSchema";
import mapObjectToFirstValue from "@/utils/mapObjectToFirstValue";
import db from "@/core/db";
import AuthError from "../error/AuthError";
import hashPassword from "../utils/hashPassword";
import { createJwtToken } from "../utils/createJwtToken";
import { cookies } from "next/headers";

export default async function createUser(userData: CreateUserSchema) {
	const validatedFields = createUserSchema.safeParse(userData);

	//Validate form input
	if (!validatedFields.success) {
		throw new DashboardError({
			errorCode: "INVALID_FORM_DATA",
			formErrors: mapObjectToFirstValue(
				validatedFields.error.flatten().fieldErrors
			),
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
	cookies().set("token", token);

	return {
		token,
	};
}
