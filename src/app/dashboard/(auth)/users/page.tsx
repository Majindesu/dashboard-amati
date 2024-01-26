import { Card, Stack, Title } from "@mantine/core";
import React from "react";
import UsersTable from "./_tables/UsersTable/UsersTable";
import checkPermission from "@/features/auth/tools/checkPermission";
import { redirect } from "next/navigation";
import getUsers from "@/features/dashboard/users/data/getUsers";
import { DeleteModal, DetailModal, EditModal } from "./_modals";
import getUserDetailById from "@/features/dashboard/users/data/getUserDetailById";

interface Props {
	searchParams: {
		detail?: string;
		edit?: string;
		delete?: string;
	}
}

export default async function UsersPage({searchParams}: Props) {

	// Check for permission and return error component if not permitted
    if (!await checkPermission("authenticated-only")) return <div>Error</div>

    const users = await getUsers()

	/**
     * Renders the appropriate modal based on the search parameters.
     * 
     * @returns A modal component or null.
     */
	const renderModal = async () => {
		if (searchParams.detail){
			const userDetail = await getUserDetailById(searchParams.detail)
			return <DetailModal data={userDetail} />
		}

		if (searchParams.edit){
			const userDetail = await getUserDetailById(searchParams.edit)
			return <EditModal data={userDetail} />
		}

		if (searchParams.delete){
			const userDetail = await getUserDetailById(searchParams.delete)
			return <DeleteModal data={userDetail} />
		}

		return null;
	}

	// TODO: Add functinoality for create new user

	return (
		<Stack className="flex flex-col">
			<Title order={1}>Users</Title>
			<Card>
				<UsersTable users={users} />
			</Card>

			{await renderModal()}
		</Stack>
	);
}
