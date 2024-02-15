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

export default function RequestTable(props: Props) {
	// const [modalProps, setModalProps] = useState<ModalProps>({
	// 	opened: false,
	// 	title: "",
	// 	readonly: false,
	// });
	const [openModal, setOpenModal] = useState(false);

	const table = useReactTable({
		data: props.tableData,
		columns: createColumns({
			permissions: props.permissions,
			actions: {
				detail: (id) => {console.log(id)}
			}
		}),
		getCoreRowModel: getCoreRowModel(),
		defaultColumn: {
			cell: (props) => <Text>{props.getValue() as ReactNode}</Text>,
		},
	});

	const openFormModall = () => {
		// setModalProps({
		// 	opened: true,
		// 	title: "Request new link",
		// 	readonly: false,
		// });
		// console.log('hai')
		setOpenModal(true);
	};

	const closeModal = () => {
		// setModalProps({
		// 	opened: false,
		// 	title: "",
		//     readonly: false,
		// });
		setOpenModal(false)
	};

	return (
		<>
			<Flex justify="flex-end">
				{
					<Button
						leftSection={<TbPlus />}
						onClick={() => openFormModall()}
					>
						New Link Request
					</Button>
				}
			</Flex>

			<DashboardTable table={table} />

			<RequestModal opened={openModal} readonly={false} title="Create new Link Request" onClose={closeModal} />
		</>
	);
}
