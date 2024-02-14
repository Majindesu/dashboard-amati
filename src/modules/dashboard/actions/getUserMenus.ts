//TODO: Change into server action
import { ThemeIconProps } from "@mantine/core";
import React from "react";
import { TbLogout, TbSettings } from "react-icons/tb";
import { UserMenuItem } from "../types/UserMenuItem";

// This function retrieves the list of user menu items for use in the application's header.
const userMenuItems: UserMenuItem[] = [
	{
		label: "Account Settings",
		icon: TbSettings,
	},
	{
		label: "Logout",
		icon: TbLogout,
		color: "red",
		href: "/logout",
	},
];

const getUserMenus = () => userMenuItems;
export default getUserMenus;
