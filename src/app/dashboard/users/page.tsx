import { Card, Stack, Title } from "@mantine/core";
import React from "react";
import getUsers from "@/modules/userManagement/actions/getAllUsers";
import { Metadata } from "next";
import UsersTable from "@/modules/userManagement/tables/UsersTable/UsersTable";
import checkMultiplePermissions from "@/modules/auth/utils/checkMultiplePermissions";

export const metadata: Metadata = {
	title: "Users - Dashboard",
};

export default async function UsersPage() {
	// Check for permission and return error component if not permitted
	const permissions = await checkMultiplePermissions({
		create: "users.create",
		readAll: "users.readAll",
		read: "users.read",
		update: "users.update",
		delete: "users.delete",
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
