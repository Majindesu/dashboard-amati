import "server-only";
import permissionFormDataSchema, { PermissionFormData } from "../formSchemas/PermissionFormData";
import DashboardError from "@/modules/dashboard/errors/DashboardError";
import mapObjectToFirstValue from "@/utils/mapObjectToFirstValue";
import db from "@/core/db";

export default async function upsertPermission(data: PermissionFormData) {
	const isInsert = !data.id;

	// Validate form data
	const validatedFields = permissionFormDataSchema.safeParse(data);
	if (!validatedFields.success) {
		throw new DashboardError({
			errorCode: "INVALID_FORM_DATA",
			formErrors: mapObjectToFirstValue(
				validatedFields.error.flatten().fieldErrors
			),
		});
	}
	const permissionData = {
		code: validatedFields.data.code,
		description: validatedFields.data.description,
		name: validatedFields.data.name,
		isActive: validatedFields.data.isActive,
	};

	// Database operation
	if (isInsert) {
		if (
			await db.permission.findFirst({
				where: {
					code: permissionData.code,
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
		return await db.permission.create({ data: permissionData });
	} else {
		return await db.permission.update({
			where: { id: validatedFields.data.id! },
			data: permissionData,
		});
	}
}
