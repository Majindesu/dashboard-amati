"use client";
import CrudPermissions from "@/modules/dashboard/types/CrudPermissions";
import { Text, Flex, Button } from "@mantine/core";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import React, { useState } from "react";
import { TbPlus } from "react-icons/tb";
import FormModal, { ModalProps } from "../../modals/FormModal";
import DeleteModal, { DeleteModalProps } from "../../modals/DeleteModal";
import createColumns from "./columns";
import DashboardTable from "@/modules/dashboard/components/DashboardTable";
import Role from "../../types/Role";

interface Props {
	permissions: Partial<CrudPermissions>;
	data: Role[];
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
		data: props.data,
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

			<DashboardTable table={table} />

			<FormModal {...modalProps} onClose={closeModal} />
			<DeleteModal
				{...deleteModalProps}
				onClose={() => setDeleteModalProps({})}
			/>
		</>
	);
}
