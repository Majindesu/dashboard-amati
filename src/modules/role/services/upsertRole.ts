import DashboardError from "@/modules/dashboard/errors/DashboardError";
import roleFormDataSchema, { RoleFormData } from "../formSchemas/RoleFormData";
import mapObjectToFirstValue from "@/utils/mapObjectToFirstValue";
import db from "@/core/db";

export default async function upsertRole(data: RoleFormData) {
	const isInsert = !data.id;

	const validatedFields = roleFormDataSchema.safeParse(data);
	if (!validatedFields.success) {
		throw new DashboardError({
			errorCode: "INVALID_FORM_DATA",
			formErrors: mapObjectToFirstValue(
				validatedFields.error.flatten().fieldErrors
			),
		});
	}
	const roleData = {
		code: validatedFields.data.code,
		description: validatedFields.data.description,
		name: validatedFields.data.name,
		isActive: validatedFields.data.isActive,
	};

	const permissionIds = validatedFields.data.permissions.map(
		(permission) => ({ code: permission })
	);

	// Database operation
	if (isInsert) {
		if (
			await db.role.findFirst({
				where: {
					code: roleData.code,
				},
			})
		) {
			throw new DashboardError({
				errorCode: "INVALID_FORM_DATA",
				formErrors: {
					code: "The code is already exists",
				},
			});
		}
		return await db.role.create({
			data: {
				...roleData,
				permissions: {
					connect: permissionIds,
				},
			},
		});
	} else {
		return await db.role.update({
			where: { id: validatedFields.data.id! },
			data: { ...roleData, permissions: { connect: permissionIds } },
		});
	}
}
