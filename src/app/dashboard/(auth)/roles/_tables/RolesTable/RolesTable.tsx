"use client";
import { Table, Text } from "@mantine/core";
import {
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import React from "react";
import columns from "./columns";

export default function RolesTable() {
	const table = useReactTable({
		data: [],
		columns,
		getCoreRowModel: getCoreRowModel(),
		defaultColumn: {
			cell: (props) => <Text>{props.getValue() as React.ReactNode}</Text>,
		},
	});

    // TODO: Add view when data is empty

	return (
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
				{table.getRowModel().rows.map((row) => (
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
				))}
			</Table.Tbody>
		</Table>
	);
}
