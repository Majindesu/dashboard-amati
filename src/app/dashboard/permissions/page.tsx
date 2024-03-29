import checkMultiplePermissions from "@/modules/auth/utils/checkMultiplePermissions";
import getAllPermissions from "@/modules/permission/actions/getAllPermissions";
import PermissionsTable from "@/modules/permission/tables/PermissionTable/PermissionTable";
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
	title: "Permissions - Dashboard",
};

export default async function RolesPage({ searchParams }: Props) {
	const permissions = await checkMultiplePermissions({
		create: "permissions.create",
		readAll: "permissions.readAll",
		read: "permissions.read",
		update: "permissions.update",
		delete: "permissions.delete",
	});
	
	const res = await getAllPermissions();
	if (!res.success) throw new Error("Error while fetch permission");
    
	return (
		<Stack>
			<Title order={1}>Permissions</Title>
			<Card>
                <PermissionsTable permissions={permissions} permissionData={res.data} />
			</Card>
		</Stack>
	);
}
