import { createColumnHelper } from "@tanstack/react-table";
import Link from "next/link";
import { ActionIcon, Anchor, Avatar, Badge, Flex, Group, Text, Tooltip } from "@mantine/core";
import { TbEye, TbPencil, TbTrash } from "react-icons/tb";
import stringToColorHex from "@/utils/stringToColorHex";

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
        cell: props => props.row.index + 1,
        size: 1
    }),

    columnHelper.accessor('name', {
        header:  "Name",
        cell: (props) => <Group>
            <Avatar color={stringToColorHex(props.row.original.id)} src={props.row.original.photoUrl}>{props.getValue()?.[0].toUpperCase()}</Avatar>
            <Text>{props.getValue()}</Text>
        </Group>
    }),

    columnHelper.accessor('email', {
        header: "Email",
        cell: (props) => <Anchor href={`mailto:${props.getValue()}`} component={Link}>{props.getValue()}</Anchor>
    }),

    columnHelper.display({
        id: "status",
        header: "Status",
        cell: (props) => <Badge color="green">Active</Badge>
    }),

    columnHelper.display({
        id: 'actions',
        header: "Actions",
        size: 10,
        meta: {
            className: "w-fit"
        },
        cell: (props) => <Flex gap="xs">

            {/* Detail */}
            <Tooltip label="Detail">
                <ActionIcon variant="light" color="green" component={Link} href={`/dashboard/users/detail/${props.row.original.id}`}>
                    <TbEye />
                </ActionIcon>
            </Tooltip>

            {/* Edit */}
            <Tooltip label="Edit">
                <ActionIcon variant="light" color="yellow" component={Link} href={`/dashboard/users/edit/${props.row.original.id}`}>
                    <TbPencil />
                </ActionIcon>
            </Tooltip>

            {/* Delete */}
            <Tooltip label="Delete">
                <ActionIcon variant="light" color="red">
                    <TbTrash />
                </ActionIcon>
            </Tooltip>
        </Flex>
    })
];

export default columns;
