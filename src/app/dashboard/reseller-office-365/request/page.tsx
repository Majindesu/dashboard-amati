import getUserRoles from "@/modules/auth/utils/getUserRoles";
import checkMultiplePermissions from "@/modules/dashboard/services/checkMultiplePermissions";
import checkPermission from "@/modules/dashboard/services/checkPermission";
import getLinkRequests from "@/modules/resellerOffice365/actions/getLinkRequests";
import RequestTable from "@/modules/resellerOffice365/tables/RequestTable/RequestTable";
import { Card, Stack, Title } from "@mantine/core";
import { notFound } from "next/navigation";
import React from "react";

export default async function RequestLinkPage() {
	const permissions = await checkMultiplePermissions({
		create: "office-365-link.create",
		readAll: "office-365-link.readAll",
		read: "office-365-link.read",
		update: "office-365-link.update",
		delete: "office-365-link.delete",
	});

	if (!permissions.readAll) notFound();

	const data = await getLinkRequests()
	if (!data.success){
		//todo: handle error
		console.error(data.error)
		throw new Error("Error while fetch permission")
	}
	const tableData = data.data

	return (
		<Stack>
			<Title order={1}>Permohonan Link Office 365</Title>
			<Card>
				<RequestTable permissions={permissions} tableData={tableData} />
			</Card>
		</Stack>
	);
}
