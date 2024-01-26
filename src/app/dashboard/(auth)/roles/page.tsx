import { Card, Stack, Title } from "@mantine/core";
import { Metadata } from "next";
import React from "react";
import RolesTable from "./_tables/RolesTable/RolesTable";

export const metadata: Metadata = {
	title: "Roles",
};

export default function RolesPage() {
	return <Stack>
        <Title order={1}>Roles</Title>
        <Card>
            <RolesTable />
        </Card>
    </Stack>;
}
