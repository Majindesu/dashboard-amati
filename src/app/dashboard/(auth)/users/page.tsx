import { Card, Stack, Title } from "@mantine/core";
import React from "react";
import UsersTable from "./_tables/UsersTable/UsersTable";
import checkPermission from "@/features/auth/tools/checkPermission";
import { redirect } from "next/navigation";
import getUsers from "@/features/dashboard/users/data/getUsers";

export default async function UsersPage() {

    if (!await checkPermission("authenticated-only")) return <div>Error</div>

    const users = await getUsers()

	return (
		<Stack className="flex flex-col">
			<Title order={1}>Users</Title>
			<Card>
				<UsersTable users={users} />
			</Card>
		</Stack>
	);
}
