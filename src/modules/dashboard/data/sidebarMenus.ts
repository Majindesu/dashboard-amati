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
				label: "My Request Links",
				link: "/reseller-office-365/request",
				allowedRoles: ["reseller-office-365"]
			},
			{
				label: "Process Request Link",
				link: "/reseller-office-365/list",
				allowedRoles: ["admin-reseller-office-365"]
			}
		]
	}
];

export default sidebarMenus;
