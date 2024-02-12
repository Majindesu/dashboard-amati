import { createColumnHelper } from "@tanstack/react-table";
import { Badge, Flex } from "@mantine/core";
import createActionButtons from "@/features/dashboard/utils/createActionButtons";
import CrudPermissions from "@/features/auth/types/CrudPermissions";
import { TbEye, TbPencil, TbTrash } from "react-icons/tb";

export interface PermissionRow {
	id: string;
	code: string;
	name: string;
	description: string;
	isActive: boolean;
	roleCount: number;
	userCount: number;
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
	const columnHelper = createColumnHelper<PermissionRow>();

	const columns = [
		columnHelper.accessor("id", {
			id: "sequence",
			header: "#",
			cell: (props) => props.row.index + 1,
		}),

		columnHelper.accessor("code", {
			header: "Code",
		}),

		columnHelper.accessor("name", {
			header: "Name",
		}),

		columnHelper.accessor("isActive", {
			header: "Status",
			cell: (props) => {
				props.getValue() ? (
					<Badge color="green">Enabled</Badge>
				) : (
					<Badge color="orange">Disabled</Badge>
				);
			},
		}),

		columnHelper.accessor("roleCount", {
			header: "Roles",
		}),

		columnHelper.accessor("userCount", {
			header: "Users",
		}),

		columnHelper.display({
			id: "Actions",
			header: "Actions",
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
									props.row.original.name
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