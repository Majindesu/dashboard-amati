"use client";
import { Table, Text, Flex, Button, Center } from "@mantine/core";
import {
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import React, { useState } from "react";
import CrudPermissions from "@/features/auth/types/CrudPermissions";
import getRoles from "@/features/dashboard/roles/data/getRoles";
import createColumns from "./columns";
import FormModal from "../../_modals/FormModal";
import { ModalProps } from "../../_modals/FormModal/FormModal";
import { TbPlus } from "react-icons/tb";
import { RoleFormData } from "@/features/dashboard/roles/formSchemas/RoleFormData";
import { string } from "zod";
import { DeleteModal } from "../../_modals";
import { DeleteModalProps } from "../../_modals/DeleteModal/DeleteModal";

interface Props {
	permissions: Partial<CrudPermissions>;
	roles: Awaited<ReturnType<typeof getRoles>>;
}

export default function RolesTable(props: Props) {
	const [modalProps, setModalProps] = useState<ModalProps>({
		opened: false,
		title: "",
	});

	const [deleteModalProps, setDeleteModalProps] = useState<
		Omit<DeleteModalProps, "onClose">
	>({
		data: undefined,
	});

	const table = useReactTable({
		data: props.roles,
		columns: createColumns({
			permissions: props.permissions,
			actions: {
				detail: (id: string) => openFormModal("detail", id),
				edit: (id: string) => openFormModal("edit", id),
				delete: (id: string, name: string) => openDeleteModal(id, name),
			},
		}),
		getCoreRowModel: getCoreRowModel(),
		defaultColumn: {
			cell: (props) => <Text>{props.getValue() as React.ReactNode}</Text>,
		},
	});

	const openFormModal = (type: "create" | "edit" | "detail", id?: string) => {
		const openCreateModal = () => {
			setModalProps({
				id,
				opened: true,
				title: "Create new role",
			});
		};

		const openDetailModal = () => {
			setModalProps({
				id,
				opened: true,
				title: "Role detail",
				readonly: true,
			});
		};

		const openEditModal = () => {
			setModalProps({
				id,
				opened: true,
				title: "Edit role",
			});
		};

		type === "create"
			? openCreateModal()
			: type === "detail"
			? openDetailModal()
			: openEditModal();
	};

	const openDeleteModal = (id: string, name: string) => {
		setDeleteModalProps({
			data: {
				id,
				name,
			},
		});
	};

	const closeModal = () => {
		setModalProps({
			id: "",
			opened: false,
			title: "",
		});
	};

	// TODO: Add view when data is empty

	return (
		<>
			<Flex justify="flex-end">
				{props.permissions.create && (
					<Button
						leftSection={<TbPlus />}
						onClick={() => openFormModal("create")}
					>
						New Role
					</Button>
				)}
			</Flex>
			<Table verticalSpacing="xs" horizontalSpacing="xs">
				{/* Thead */}
				<Table.Thead>
					{table.getHeaderGroups().map((headerGroup) => (
						<Table.Tr key={headerGroup.id}>
							{headerGroup.headers.map((header) => (
								<Table.Th
									key={header.id}
									style={{
										maxWidth: `${header.column.columnDef.maxSize}px`,
										width: `${header.getSize()}`,
									}}
								>
									{header.isPlaceholder
										? null
										: flexRender(
												header.column.columnDef.header,
												header.getContext()
										  )}
								</Table.Th>
							))}
						</Table.Tr>
					))}
				</Table.Thead>

				{/* Tbody */}
				<Table.Tbody>
					{table.getRowModel().rows.length > 0 ? (
						table.getRowModel().rows.map((row) => (
							<Table.Tr key={row.id}>
								{row.getVisibleCells().map((cell) => (
									<Table.Td
										key={cell.id}
										style={{
											maxWidth: `${cell.column.columnDef.maxSize}px`,
										}}
									>
										{flexRender(
											cell.column.columnDef.cell,
											cell.getContext()
										)}
									</Table.Td>
								))}
							</Table.Tr>
						))
					) : (
						<Table.Tr>
							<Table.Td colSpan={table.getAllColumns().length}>
								<Center>- No Data -</Center>
							</Table.Td>
						</Table.Tr>
					)}
				</Table.Tbody>
			</Table>

			<FormModal {...modalProps} onClose={closeModal} />
			<DeleteModal
				{...deleteModalProps}
				onClose={() => setDeleteModalProps({})}
			/>
		</>
	);
}
