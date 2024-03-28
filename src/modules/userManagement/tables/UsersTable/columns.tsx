import { createColumnHelper } from "@tanstack/react-table";
import { Badge, Flex, Group, Avatar, Text, Anchor } from "@mantine/core";
import { TbEye, TbPencil, TbTrash } from "react-icons/tb";
import CrudPermissions from "@/modules/dashboard/types/CrudPermissions";
import stringToColorHex from "@/core/utils/stringToColorHex";
import Link from "next/link";
import createActionButtons from "@/modules/dashboard/utils/createActionButton";

export interface UserRow {
	id: string;
	name: string | null;
	email: string | null;
	photoUrl: string | null;
	roles: string[]
}

interface ColumnOptions {
	permissions: Partial<CrudPermissions>;
	actions: {
		detail: (id: string) => void;
		edit: (id: string) => void;
		delete: (id: string, name: string) => void;
	};
}

const createColumns = (options: ColumnOptions) => {
	const columnHelper = createColumnHelper<UserRow>();

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
						src={props.row.original.photoUrl}
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
					href={`mailto:${props.getValue()}`}
					size="sm"
					component={Link}
				>
					{props.getValue()}
				</Anchor>
			),
		}),

		columnHelper.accessor("roles", {
			header: "Role",
			cell: (props) => <Text>{props.getValue()[0]}</Text>
		}),

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
