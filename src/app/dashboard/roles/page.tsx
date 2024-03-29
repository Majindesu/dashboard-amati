import checkMultiplePermissions from "@/modules/auth/utils/checkMultiplePermissions";
import unauthorized from "@/modules/dashboard/utils/unauthorized";
import getAllRoles from "@/modules/role/services/getAllRoles";
import RolesTable from "@/modules/role/tables/RolesTable/RolesTable";
import { Card, Stack, Title } from "@mantine/core";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
	title: "Roles - Dashboard",
};

export default async function RolesPage() {
	const permissions = await checkMultiplePermissions({
		create: "roles.create",
		readAll: "roles.readAll",
		read: "roles.read",
		update: "roles.update",
		delete: "roles.delete",
	});

	if (!permissions.readAll) unauthorized()

	const roles = await getAllRoles();

	return (
		<Stack>
			<Title order={1}>Roles</Title>
			<Card>
				<RolesTable permissions={permissions} data={roles} />
			</Card>
		</Stack>
	);
}
