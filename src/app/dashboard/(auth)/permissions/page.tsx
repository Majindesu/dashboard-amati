import { Card, Stack, Title } from "@mantine/core";
import { Metadata } from "next";
import React from "react";
// import RolesTable from "./_tables/RolesTable/RolesTable";
// import getRoles from "@/features/dashboard/roles/data/getRoles";
import checkMultiplePermissions from "@/features/auth/tools/checkMultiplePermissions";
import { PermissionTable } from "@/features/dashboard/permissions/tables";
import getPermissions from "@/features/dashboard/permissions/data/getPermissions";

interface Props {
	searchParams: {
		detail?: string;
		edit?: string;
		delete?: string;
		create?: string;
	};
}

export const metadata: Metadata = {
	title: "Permissions - Dashboard",
};

export default async function RolesPage({ searchParams }: Props) {
	const permissions = await checkMultiplePermissions({
		create: "permission.create",
		readAll: "permission.readAll",
		read: "permission.read",
		update: "permission.update",
		delete: "permission.delete",
	});
    
    const permissionData = await getPermissions()
    
	return (
		<Stack>
			<Title order={1}>Permissions</Title>
			<Card>
                <PermissionTable permissions={permissions} permissionData={permissionData} />
			</Card>
		</Stack>
	);
}
