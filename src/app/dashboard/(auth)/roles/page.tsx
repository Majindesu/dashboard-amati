import { Button, Card, Flex, Stack, Title } from "@mantine/core";
import { Metadata } from "next";
import React from "react";
import RolesTable from "./_tables/RolesTable/RolesTable";
import { TbPlus } from "react-icons/tb";
import checkPermission from "@/features/auth/tools/checkPermission";
import { unauthorized } from "@/BaseError";
import Link from "next/link";
import { CreateModal } from "./_modals";
import FormModal from "./_modals/FormModal";
import CreateButton from "./_components/CreateButton/CreateButton";
import getRoles from "@/features/dashboard/roles/data/getRoles";
import checkMultiplePermissions from "@/features/auth/tools/checkMultiplePermissions";

interface Props {
    searchParams: {
        detail?: string,
        edit?: string,
        delete?: string,
        create?: string,
    }
}

export default async function RolesPage({searchParams}: Props) {

	const permissions = await checkMultiplePermissions({
		create: "role.create",
		readAll: "role.readAll",
		read: 'role.read',
		update: 'role.update',
		delete: 'role.delete'
	})

	const roles = await getRoles()

	return (
		<Stack>
			<Title order={1}>Roles</Title>
			<Card>
				<Flex justify="flex-end">
					{ permissions.create && <CreateButton />}
				</Flex>
				<RolesTable permissions={permissions} roles={roles} />
			</Card>
		</Stack>
	);
}
