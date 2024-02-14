"use client";
import CrudPermissions from "@/modules/dashboard/types/CrudPermissions";
import { Table, Text, Flex, Button, Center } from "@mantine/core";
import {
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import React, { useState } from "react";
import { TbPlus } from "react-icons/tb";
import getPermissions from "../../actions/getAllPermissions";
import getAllPermissions from "../../actions/getAllPermissions";
import FormModal, { ModalProps } from "../../modals/PermissionFormModal";
import DeleteModal, { DeleteModalProps } from "../../modals/PermissionDeleteModal";
import Permission from "../../types/Permission";
import createColumns from "./columns";
import DashboardTable from "@/modules/dashboard/components/DashboardTable";

interface Props {
	permissions: Partial<CrudPermissions>;
	permissionData: Permission[];
}

export default function PermissionsTable(props: Props) {
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
		data: props.permissionData,
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
				title: "Create new permission",
			});
		};

		const openDetailModal = () => {
			setModalProps({
				id,
				opened: true,
				title: "Permission detail",
				readonly: true,
			});
		};

		const openEditModal = () => {
			setModalProps({
				id,
				opened: true,
				title: "Edit permission",
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
						New Permission
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
