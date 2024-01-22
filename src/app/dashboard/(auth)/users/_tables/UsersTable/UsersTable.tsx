"use client";
import React, { useCallback, useEffect, useState } from "react";

import {
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import columns, { UserRow } from "./columns";
import { Table, TableThead, Text } from "@mantine/core";
import { showErrorNotification } from "@/utils/notifications";

interface Props {
	users: UserRow[]
}

export default function UsersTable({users}: Props) {

	const table = useReactTable({
		data: users,
		columns,
		getCoreRowModel: getCoreRowModel(),
		defaultColumn: {
			cell: (props) => <Text>{props.getValue() as React.ReactNode}</Text>
		}
	});

	return (
		<Table verticalSpacing="sm" horizontalSpacing="xs">
			{/* Thead */}
			<Table.Thead>
				{table.getHeaderGroups().map((headerGroup) => (
					<Table.Tr key={headerGroup.id}>
						{headerGroup.headers.map((header) => (
							<Table.Th key={header.id} style={{maxWidth: `${header.column.columnDef.maxSize}px`, width: `${header.getSize()}`}}>
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

			{/* TBody */}
			<Table.Tbody>
				{table.getRowModel().rows.map((row) => (
					<Table.Tr key={row.id}>
						{row.getVisibleCells().map((cell) => (
							<Table.Td key={cell.id} style={{maxWidth: `${cell.column.columnDef.maxSize}px`}}>
								{flexRender(
									cell.column.columnDef.cell,
									cell.getContext(),
								)}
							</Table.Td>
						))}
					</Table.Tr>
				))}
			</Table.Tbody>
		</Table>
	);
}
