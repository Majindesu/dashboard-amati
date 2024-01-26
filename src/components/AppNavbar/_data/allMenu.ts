import { ThemeIconProps } from "@mantine/core";
import React from "react";
import {
	TbLayoutDashboard,
	TbUsers,
	TbNotebook,
	TbShoppingBag,
	TbPhotoFilled,
} from "react-icons/tb";

export interface MenuItem {
	label: string;
	icon: React.FC<any>;
	children?: {
		label: string;
		link: string;
	}[];
	color?: ThemeIconProps["color"];
}

const allMenu: MenuItem[] = [
	{
		label: "Dashboard",
		icon: TbLayoutDashboard,
	},
	{
		label: "Users",
		icon: TbUsers,
		color: "grape",
		children: [
			{ label: "Users", link: "/users" },
			{ label: "Roles", link: "/roles" },
			{ label: "Permissions", link: "#" },
		],
	},
	{
		label: "Blog",
		icon: TbNotebook,
		color: "green",
		children: [
			{ label: "Posts", link: "#" },
			{ label: "Categories", link: "#" },
			{ label: "Tags", link: "#" },
		],
	},
	{
		label: "Products",
		icon: TbShoppingBag,
		color: "cyan",
	},
	{
		label: "Banners",
		icon: TbPhotoFilled,
		color: "indigo",
	},
];

export default allMenu;
