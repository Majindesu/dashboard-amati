import SidebarMenu from "../types/SidebarMenu";

const sidebarMenus: SidebarMenu[] = [
	{
		label: "Dashboard",
		icon: "TbLayoutDashboard",
		allowedPermissions: ["*"],
	},
	{
		label: "Users",
		icon: "TbUsers",
		color: "grape",
		children: [
			{
				label: "Users",
				link: "/users",
				allowedPermissions: ["users.getAll"],
			},
			{ label: "Roles", link: "/roles", allowedRoles: ["super-admin"] },
			{
				label: "Permissions",
				link: "/permissions",
				allowedRoles: ["super-admin"],
			},
		],
	},
	{
		label: "Reseller Office 365",
		icon: "TbBuildingStore",
		color: "red",
		allowedPermissions: ["*"],
		children: [
			{
				label: "Request Link",
				link: "/reseller-office-365/request",
				allowedRoles: ["*"]
			},
			{
				label: "Respond Request Link",
				link: "#",
				allowedRoles: ["*"]
			}
		]
	}
];

export default sidebarMenus;
