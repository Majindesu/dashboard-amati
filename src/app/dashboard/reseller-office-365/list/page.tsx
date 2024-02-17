import getUserRoles from "@/modules/auth/utils/getUserRoles";
import checkMultiplePermissions from "@/modules/dashboard/services/checkMultiplePermissions";
import checkPermission from "@/modules/dashboard/services/checkPermission";
import getAllLinkRequests from "@/modules/resellerOffice365/actions/getAllLinkRequests";
import getLinkRequests from "@/modules/resellerOffice365/actions/getLinkRequests";
import ListOfRequestTable from "@/modules/resellerOffice365/tables/ListOfRequestTable/ListOfRequestTable";
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

	const data = await getAllLinkRequests();
	if (!data.success) {
		//todo: handle error
		console.error(data.error);
		throw new Error("Error while fetch data");
	}
	const tableData = data.data;

	return (
		<Stack>
			<Title order={1}>List Link Office 365</Title>
			<Card>
				<ListOfRequestTable permissions={permissions} tableData={tableData} />
			</Card>
		</Stack>
	);
}
