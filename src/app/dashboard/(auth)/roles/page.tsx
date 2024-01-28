import { Card, Stack, Title } from "@mantine/core";
import { Metadata } from "next";
import React from "react";
import RolesTable from "./_tables/RolesTable/RolesTable";
import getRoles from "@/features/dashboard/roles/data/getRoles";
import checkMultiplePermissions from "@/features/auth/tools/checkMultiplePermissions";
import { unauthorized } from "@/features/dashboard/errors/DashboardError";

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

export default async function RolesPage({ searchParams }: Props) {
	const permissions = await checkMultiplePermissions({
		create: "role.create",
		readAll: "role.readAll",
		read: "role.read",
		update: "role.update",
		delete: "role.delete",
	});

	if (!permissions.readAll) unauthorized()

	const roles = await getRoles();

	return (
		<Stack>
			<Title order={1}>Roles</Title>
			<Card>
				<RolesTable permissions={permissions} roles={roles} />
			</Card>
		</Stack>
	);
}
