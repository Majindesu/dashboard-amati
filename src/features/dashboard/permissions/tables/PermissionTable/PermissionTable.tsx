"use client";
import { Table, Text, Flex, Button, Center } from "@mantine/core";
import {
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import React, { useState } from "react";
import CrudPermissions from "@/features/auth/types/CrudPermissions";
import { TbPlus } from "react-icons/tb";
import { PermissionFormData } from "@/features/dashboard/permissions/formSchemas/PermissionFormData";
import { string } from "zod";
import { DashboardTable } from "@/features/dashboard/components";
import getPermissions from "../../data/getPermissions";
import FormModal, { ModalProps } from "../../modals/FormModal/FormModal";
import DeleteModal, { DeleteModalProps } from "../../modals/DeleteModal/DeleteModal";
import createColumns from "./_columns";

interface Props {
	permissions: Partial<CrudPermissions>;
	permissionData: Awaited<ReturnType<typeof getPermissions>>;
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
