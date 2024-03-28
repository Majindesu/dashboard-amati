import { PermissionCode } from "@/modules/permission/data/initialPermissions";
import { RoleCode } from "@/modules/permission/data/initialRoles";

export default interface SidebarMenu {
	label: string;
	icon: React.FC<any> | string;
	children?: {
		label: string;
		link: string;
		allowedPermissions?: PermissionCode[];
		allowedRoles?: RoleCode[];
	}[];
	link?: string;
	color?: ThemeIconProps["color"];
	allowedPermissions?: PermissionCode[];
	allowedRoles?: RoleCode[];
}
