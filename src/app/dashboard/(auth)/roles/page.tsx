import checkMultiplePermissions from "@/modules/dashboard/services/checkMultiplePermissions";
import unauthorized from "@/modules/dashboard/utils/unauthorized";
import getAllRoles from "@/modules/role/actions/getAllRoles";
import RolesTable from "@/modules/role/tables/RolesTable/RolesTable";
import { Card, Stack, Title } from "@mantine/core";
import { Metadata } from "next";
import React from "react";

interface Props {
	searchParams: {
		detail?: string;
		edit?: string;
		delete?: string;
		create?: string;
	};
}

export const metadata: Metadata = {
	title: "Roles - Dashboard",
};

export default async function RolesPage() {
	const permissions = await checkMultiplePermissions({
		create: "role.create",
		readAll: "role.readAll",
		read: "role.read",
		update: "role.update",
		delete: "role.delete",
	});

	if (!permissions.readAll) unauthorized()

	const roles = await getAllRoles();

	return (
		<Stack>
			<Title order={1}>Roles</Title>
			<Card>
				<RolesTable permissions={permissions} roles={roles} />
			</Card>
		</Stack>
	);
}
