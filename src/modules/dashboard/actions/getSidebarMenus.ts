import { ThemeIconProps } from "@mantine/core";
import React from "react";
import {
	TbLayoutDashboard,
	TbUsers,
	TbNotebook,
	TbShoppingBag,
	TbPhotoFilled,
} from "react-icons/tb";
import SidebarMenu from "../types/SidebarMenu";

const sidebarMenus: SidebarMenu[] = [
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
			{ label: "Permissions", link: "/permissions" },
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

//TODO: Change into server actions
const getSidebarMenus = () => sidebarMenus;

export default getSidebarMenus;
