import { createColumnHelper } from "@tanstack/react-table";
import { Badge, Flex, Group, Avatar, Text, Anchor } from "@mantine/core";
import { TbEye, TbPencil, TbTrash } from "react-icons/tb";
import { CrudPermission } from "@/types";
import stringToColorHex from "@/utils/stringToColorHex";
import createActionButtons from "@/utils/createActionButton";
import client from "@/honoClient";
import { InferResponseType } from "hono";
import { Link } from "@tanstack/react-router";

interface ColumnOptions {
	permissions: Partial<CrudPermission>;
	actions: {
		detail: (id: string) => void;
		edit: (id: string) => void;
		delete: (id: string, name: string) => void;
	};
}

const createColumns = (options: ColumnOptions) => {
	const columnHelper =
		createColumnHelper<
			InferResponseType<typeof client.users.$get>[number]
		>();

	const columns = [
		columnHelper.display({
			id: "sequence",
			header: "#",
			cell: (props) => props.row.index + 1,
			size: 1,
		}),

		columnHelper.accessor("name", {
			header: "Name",
			cell: (props) => (
				<Group>
					<Avatar
						color={stringToColorHex(props.row.original.id)}
						// src={props.row.original.photoUrl}
						size={26}
					>
						{props.getValue()?.[0].toUpperCase()}
					</Avatar>
					<Text size="sm" fw={500}>
						{props.getValue()}
					</Text>
				</Group>
			),
		}),

		columnHelper.accessor("email", {
			header: "Email",
			cell: (props) => (
				<Anchor
					to={`mailto:${props.getValue()}`}
					size="sm"
					component={Link}
				>
					{props.getValue()}
				</Anchor>
			),
		}),

		// columnHelper.accessor("roles", {
		// 	header: "Role",
		// 	cell: (props) => <Text>{props.getValue()[0]}</Text>,
		// }),

		columnHelper.display({
			id: "status",
			header: "Status",
			cell: () => <Badge color="green">Active</Badge>,
		}),

		columnHelper.display({
			id: "actions",
			header: "Actions",
			size: 10,
			meta: {
				className: "w-fit",
			},
			cell: (props) => (
				<Flex gap="xs">
					{createActionButtons([
						{
							label: "Detail",
							permission: options.permissions.read,
							action: () =>
								options.actions.detail(props.row.original.id),
							color: "green",
							icon: <TbEye />,
						},
						{
							label: "Edit",
							permission: options.permissions.update,
							action: () =>
								options.actions.edit(props.row.original.id),
							color: "yellow",
							icon: <TbPencil />,
						},
						{
							label: "Delete",
							permission: options.permissions.delete,
							action: () =>
								options.actions.delete(
									props.row.original.id,
									props.row.original.name ?? ""
								),
							color: "red",
							icon: <TbTrash />,
						},
					])}
				</Flex>
			),
		}),
	];

	return columns;
};

export default createColumns;