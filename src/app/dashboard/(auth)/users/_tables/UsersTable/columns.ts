import { createColumnHelper } from "@tanstack/react-table";

export interface UserRow {
    id: string,
    name: string | null,
    email: string | null,
    photoUrl: string | null,
}

const columnHelper = createColumnHelper<UserRow>()

const columns = [
    columnHelper.display({
        id: "seequence",
        header: "#",
        cell: props => props.row.index + 1
    }),

    columnHelper.accessor('name', {}),

    columnHelper.accessor('email', {}),

    columnHelper.display({
        id: 'actions',
        cell: () => 'actions'
    })
];

export default columns;
