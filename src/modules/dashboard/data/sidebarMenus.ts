import SidebarMenu from "../types/SidebarMenu";

const sidebarMenus: SidebarMenu[] = [
	{
		label: "Dashboard",
		icon: "TbLayoutDashboard",
		allowedPermissions: ["*"],
		link: "/",
	},
	{
		label: "Users",
		icon: "TbUsers",
		color: "grape",
		children: [
			{
				label: "Users",
				link: "/users",
				allowedPermissions: ["users.readAll"],
			},
			{ label: "Roles", link: "/roles", allowedRoles: ["super-admin"] },
			{
				label: "Permissions",
				link: "/permissions",
				allowedRoles: ["super-admin"],
			},
		],
	},
];

export default sidebarMenus;
