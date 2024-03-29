import checkMultiplePermissions from "@/modules/auth/utils/checkMultiplePermissions";
import getAllPermissions from "@/modules/permission/services/getAllPermissions";
import PermissionsTable from "@/modules/permission/tables/PermissionTable/PermissionTable";
import { Card, Stack, Title } from "@mantine/core";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
	title: "Permissions - Dashboard",
};

export default async function RolesPage() {
	const permissions = await checkMultiplePermissions({
		create: "permissions.create",
		readAll: "permissions.readAll",
		read: "permissions.read",
		update: "permissions.update",
		delete: "permissions.delete",
	});
	
	const permissionsData = await getAllPermissions();
    
	return (
		<Stack>
			<Title order={1}>Permissions</Title>
			<Card>
                <PermissionsTable permissions={permissions} data={permissionsData} />
			</Card>
		</Stack>
	);
}
