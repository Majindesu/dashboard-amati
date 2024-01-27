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

interface Props {
    searchParams: {
        detail?: string,
        edit?: string,
        delete?: string,
        create?: string,
    }
}

export const metadata: Metadata = {
	title: "Roles",
};

export default async function RolesPage({searchParams}: Props) {
	if (!(await checkPermission("role.readAll"))) {
		return unauthorized();
	}

	const allowCreate = await checkPermission("role.create")

	return (
		<Stack>
			<Title order={1}>Roles</Title>
			<Card>
				<Flex justify="flex-end">
					{ allowCreate && <CreateButton />}
				</Flex>
				<RolesTable permissions={{}} />
			</Card>
		</Stack>
	);
}
