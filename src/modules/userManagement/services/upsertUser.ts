import DashboardError from "@/modules/dashboard/errors/DashboardError";
import userFormDataSchema, {
	UserFormData,
} from "../formSchemas/userFormSchema";
import mapObjectToFirstValue from "@/utils/mapObjectToFirstValue";
import hashPassword from "@/modules/auth/utils/hashPassword";
import db from "@/core/db";
import "server-only"

export default async function upsertUser(data: UserFormData) {
	const isInsert = !data.id;

	// Validate form data
	const validatedFields = userFormDataSchema.safeParse(data);
	if (!validatedFields.success) {
		throw new DashboardError({
			errorCode: "INVALID_FORM_DATA",
			formErrors: mapObjectToFirstValue(
				validatedFields.error.flatten().fieldErrors
			),
		});
	}
	const userData = {
		id: validatedFields.data.id ? validatedFields.data.id : undefined,
		name: validatedFields.data.name,
		photoProfile: validatedFields.data.photoProfileUrl ?? "",
		email: validatedFields.data.email,
	};

	const passwordHash = await hashPassword(validatedFields.data.password!);

	const roles = await db.role.findMany({
		where: {
			code: {
				in: validatedFields.data.roles,
			},
		},
		select: {
			id: true, // Only select the id field
		},
	});

	// Database operation
	if (isInsert) {
		if (
			await db.user.findFirst({
				where: {
					email: userData.email,
				},
			})
		) {
			throw new DashboardError({
				errorCode: "INVALID_FORM_DATA",
				formErrors: {
					email: "The user is already exists",
				},
			});
		}

		return await db.user.create({
			data: {
				...userData,
				passwordHash,
				roles: {
					connect: roles.map((role) => ({ id: role.id })),
				},
			},
		});
	} else {
		return await db.user.update({
			where: { id: validatedFields.data.id! },
			data: {
				...userData,
				roles: {
					set: roles.map((role) => ({ id: role.id })),
				},
			},
		});
	}
}
