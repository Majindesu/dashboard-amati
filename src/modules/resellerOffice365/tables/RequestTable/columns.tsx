import { createColumnHelper } from "@tanstack/react-table";
import { Badge, Flex } from "@mantine/core";
import { TbEye, TbPencil, TbTrash } from "react-icons/tb";
import CrudPermissions from "@/modules/dashboard/types/CrudPermissions";
import createActionButtons from "@/modules/dashboard/utils/createActionButton";

export interface RequestLinkRow {
	id: string;
	requestDate: Date,
    userCount: number,
    status: string
}

interface ColumnOptions {
	permissions: Partial<CrudPermissions>;
	actions: {
		detail: (id: string) => void;
		// edit: (id: string) => void;
		// delete: (id: string) => void;
	};
}

const createColumns = (options: ColumnOptions) => {
	const columnHelper = createColumnHelper<RequestLinkRow>();

	const columns = [
		columnHelper.accessor("id", {
			id: "sequence",
			header: "#",
			cell: (props) => props.row.index + 1,
		}),

		columnHelper.accessor("requestDate", {
			header: "Request Date",
		}),

		columnHelper.accessor("userCount", {
			header: "User Count",
		}),

		columnHelper.accessor("status", {
			header: "Status",
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
							// action: () =>
							// 	options.actions.edit(props.row.original.id),
							color: "yellow",
							icon: <TbPencil />,
						},
						{
							label: "Delete",
							permission: options.permissions.delete,
							// action: () =>
							// 	options.actions.delete(
							// 		props.row.original.id
							// 	),
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
