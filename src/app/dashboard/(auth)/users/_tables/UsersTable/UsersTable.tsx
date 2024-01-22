"use client";
import React, { useCallback, useEffect, useState } from "react";

import {
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import columns, { UserRow } from "./columns";
import { Table, TableThead } from "@mantine/core";
import { showErrorNotification } from "@/utils/notifications";

interface Props {
	users: UserRow[]
}

export default function UsersTable({users}: Props) {

	const table = useReactTable({
		data: users,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	return (
		<Table>
			{/* Thead */}
			<Table.Thead>
				{table.getHeaderGroups().map((headerGroup) => (
					<Table.Tr key={headerGroup.id}>
						{headerGroup.headers.map((header) => (
							<Table.Th key={header.id}>
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
							<td key={cell.id}>
								{flexRender(
									cell.column.columnDef.cell,
									cell.getContext()
								)}
							</td>
						))}
					</Table.Tr>
				))}
			</Table.Tbody>
		</Table>
	);
}
