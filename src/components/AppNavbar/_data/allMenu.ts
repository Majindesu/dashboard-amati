import React from "react";
import { TbLayoutDashboard, TbUsers } from "react-icons/tb";

export interface MenuItem {
    label: string,
    icon: React.FC<any>,
    children?: {
        label: string,
        link: string,
    }[],
    color?: string,
}

const allMenu: MenuItem[] = [
	{
		label: "Dashboard",
		icon: TbLayoutDashboard,
	},
	{
		label: "Users",
		icon: TbUsers,
        color: "green",
        children: [
            { label: "Users", link: "#"},
            { label: "Roles", link: "#"},
            { label: "Permissions", link: "#"},
        ]
	},
];

export default allMenu;
