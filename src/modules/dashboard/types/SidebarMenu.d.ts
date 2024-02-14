export default interface SidebarMenu {
	label: string;
	icon: React.FC<any> | string;
	children?: {
		label: string;
		link: string;
		allowedPermissions?: string[],
		allowedRoles?: string[],
	}[];
	color?: ThemeIconProps["color"];
	allowedPermissions?: string[],
	allowedRoles?: string[]
}