import { createColumnHelper } from "@tanstack/react-table";
import { StringifyOptions } from "querystring";

export interface RoleRow {
    id: string,
    code: string,
    name: string,
    permissionCount: number,
    userCount: number,
}

const columnHelper = createColumnHelper<RoleRow>()

const columns = [
    columnHelper.accessor("id",{
        id: "sequence",
        header: "#",
        cell: props => props.row.index + 1,
    }),
    
    columnHelper.accessor("code", {
        header: 'Code',
    }),

    columnHelper.accessor("name", {
        header: "Name"
    }),

    columnHelper.accessor("permissionCount", {
        header: "Permissions"
    }),

    columnHelper.accessor("userCount", {
        header: "Users"
    }),
]

export default columns;
