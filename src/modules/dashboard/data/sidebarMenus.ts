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
		label: "Blog",
		icon: "TbNotebook",
		color: "green",
		children: [
			{ label: "Posts", link: "#" },
			{ label: "Categories", link: "#" },
			{ label: "Tags", link: "#" },
		],
	},
	{
		label: "Products",
		icon: "TbShoppingBag",
		color: "cyan",
	},
	{
		label: "Banners",
		icon: "TbPhotoFilled",
		color: "indigo",
	},
];

export default sidebarMenus;
