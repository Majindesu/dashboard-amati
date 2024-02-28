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
import UserFormModal, { ModalProps } from "../../modals/UserFormModal";
import UserDeleteModal, { DeleteModalProps } from "../../modals/UserDeleteModal";
import createColumns from "./columns";
import getAllUsers from "../../actions/getAllUsers";
import DashboardTable from "@/modules/dashboard/components/DashboardTable";

interface Props {
	permissions: Partial<CrudPermissions>;
	userData: Awaited<ReturnType<typeof getAllUsers>>;
}

export default function UsersTable(props: Props) {
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
		data: props.userData.map(data => ({...data, roles: data.roles.map(x => x.name)})),
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
				title: "Create new user",
			});
		};

		const openDetailModal = () => {
			setModalProps({
				id,
				opened: true,
				title: "User detail",
				readonly: true,
			});
		};

		const openEditModal = () => {
			setModalProps({
				id,
				opened: true,
				title: "Edit user",
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
						New User
					</Button>
				)}
			</Flex>
			
			<DashboardTable table={table} />

			<UserFormModal {...modalProps} onClose={closeModal} />
			<UserDeleteModal
				{...deleteModalProps}
				onClose={() => setDeleteModalProps({})}
			/>
		</>
	);
}
