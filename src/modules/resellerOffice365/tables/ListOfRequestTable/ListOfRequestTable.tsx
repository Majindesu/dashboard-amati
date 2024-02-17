"use client";
import DashboardTable from "@/modules/dashboard/components/DashboardTable";
import { Button, Flex, Text } from "@mantine/core";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import React, { ReactNode, useState } from "react";
import { TbPlus } from "react-icons/tb";
import createColumns from "./columns";
import CrudPermissions from "@/modules/dashboard/types/CrudPermissions";
import RequestLink from "../../types/RequestLink";
import RequestModal, { ModalProps } from "../../modals/RequestModal";
import RequestLinkWithIssuerData from "../../types/RequestLinkWithIssuerData";

interface Props {
	permissions: Partial<CrudPermissions>;
	tableData: RequestLinkWithIssuerData[];
}

const defaultModalProps: ModalProps = {
	opened: false,
	title: "Create new Link",
	type: "create",
	detailId: null,
};

export default function ListOfRequestTable(props: Props) {
	const [modalProps, setModalProps] = useState<ModalProps>(defaultModalProps);
	// const [openModal, setOpenModal] = useState(false);

	const table = useReactTable({
		data: props.tableData,
		columns: createColumns({
			permissions: props.permissions,
			actions: {
				detail: (id) => {
					openFormModal(id);
				},
			},
		}),

		getCoreRowModel: getCoreRowModel(),
		defaultColumn: {
			cell: (props) => <Text>{props.getValue() as ReactNode}</Text>,
		},
	});

	const openFormModal = (id: string) => {
		setModalProps({
			opened: true,
			title: "Request Detail",
			type: "input link",
			detailId: id,
		});
	};

	const closeModal = () => {
		setModalProps(defaultModalProps);
	};

	return (
		<>
			<DashboardTable table={table} />

			<RequestModal {...modalProps} onClose={closeModal} />
		</>
	);
}
