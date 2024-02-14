import { Card, Stack, Title } from "@mantine/core";
import React from "react";
import getUsers from "@/modules/userManagement/actions/getAllUsers";
import { Metadata } from "next";
import checkMultiplePermissions from "@/modules/dashboard/services/checkMultiplePermissions";
import UsersTable from "@/modules/userManagement/tables/UsersTable/UsersTable";

export const metadata: Metadata = {
	title: "Users - Dashboard",
};

export default async function UsersPage() {
	// Check for permission and return error component if not permitted
	const permissions = await checkMultiplePermissions({
		create: "users.create",
		readAll: "users.readAll",
		read: "permission.read",
		update: "permission.update",
		delete: "permission.delete",
	});

	const users = await getUsers();

	return (
		<Stack>
			<Title order={1}>Users</Title>
			<Card>
				<UsersTable permissions={permissions} userData={users} />
			</Card>
		</Stack>
	);
}
