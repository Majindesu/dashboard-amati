import { createColumnHelper } from "@tanstack/react-table";
import { Badge, Flex } from "@mantine/core";
import { TbEye, TbPencil, TbTrash } from "react-icons/tb";
import CrudPermissions from "@/modules/dashboard/types/CrudPermissions";
import createActionButtons from "@/modules/dashboard/utils/createActionButton";

export interface RequestLinkRow {
	id: string;
	requestDate: string;
	userCount: number;
	status: string;
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
			cell: (props) => {
				const date = new Date(props.row.original.requestDate);
				return `${date.toDateString()}; ${date.toLocaleTimeString()}`;
			},
		}),

		columnHelper.accessor("userCount", {
			header: "User Count",
		}),

		columnHelper.accessor("status", {
			header: "Status",
			cell: (props) => {
				switch (props.row.original.status) {
					case "WAITING":
						return <Badge color="cyan">WAITING</Badge>;
						break;
					case "ACCEPTED":
						return <Badge color="green">ACCEPTED</Badge>;
						break;
					case "CANCELLED":
						return <Badge color="gray">CANCELLED</Badge>;
						break;
					case "REJECTED":
						return <Badge color="red">REJECTED</Badge>;
						break;
				}
			},
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
					])}
				</Flex>
			),
		}),
	];

	return columns;
};

export default createColumns;