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

interface Props {
	permissions: Partial<CrudPermissions>;
	tableData: RequestLink[];
}

const defaultModalProps: ModalProps = {
	opened: false,
	title: "",
	type: "create",
	detailId: null,
};

export default function RequestTable(props: Props) {
	const [modalProps, setModalProps] = useState<ModalProps>(defaultModalProps);

	const table = useReactTable({
		data: props.tableData,
		columns: createColumns({
			permissions: props.permissions,
			actions: {
				detail: (id) => {
					openDetailModal(id);
				},
			},
		}),
		getCoreRowModel: getCoreRowModel(),
		defaultColumn: {
			cell: (props) => <Text>{props.getValue() as ReactNode}</Text>,
		},
	});

	const openCreateModal = () => {
		setModalProps({
			opened: true,
			title: "Create New Office 365 Link Request",
			detailId: null,
			type: "create",
		});
	};

	const openDetailModal = (id: string) => {
		setModalProps({
			opened: true,
			title: "Office 365 Link Request Detail",
			detailId: id,
			type: "detail",
		});
	};

	const closeModal = () => {
		setModalProps(defaultModalProps);
	};

	return (
		<>
			<Flex justify="flex-end">
				{
					<Button leftSection={<TbPlus />} onClick={openCreateModal}>
						New Link Request
					</Button>
				}
			</Flex>

			<DashboardTable table={table} />

			<RequestModal {...modalProps} onClose={closeModal} />
		</>
	);
}
