import "server-only";
import SidebarMenu from "../types/SidebarMenu";
import getUserRoles from "@/modules/auth/utils/getUserRoles";
import getUserPermissions from "@/modules/auth/utils/getUserPermissions";
import sidebarMenus from "../data/sidebarMenus";

export default async function getSidebarMenus() {
	const filteredMenus: SidebarMenu[] = [];

	const roles = await getUserRoles();
	const permissions = await getUserPermissions();

	for (let menu of sidebarMenus) {
		//if has children
		if (menu.children) {
			const currentMenuChildren: SidebarMenu["children"] = [];
			for (let menuChild of menu.children) {
				if (
					menuChild.allowedPermissions?.some((perm) =>
						permissions?.includes(perm)
					) ||
					menuChild.allowedRoles?.some((role) =>
						roles?.includes(role)
					) ||
					menuChild.allowedPermissions?.includes("*") ||
					menuChild.allowedRoles?.includes("*") ||
					roles.includes("super-admin")
				)
					currentMenuChildren.push(menuChild);
			}

			if (currentMenuChildren.length > 0) {
				filteredMenus.push({
					...menu,
					children: currentMenuChildren,
				});
			}
		}
		//if does not have any children
		else {
			if (
				menu.allowedPermissions?.some((perm) =>
					permissions?.includes(perm)
				) ||
				menu.allowedRoles?.some((role) => roles?.includes(role)) ||
				menu.allowedPermissions?.includes("*") ||
				menu.allowedRoles?.includes("*")
			) {
				filteredMenus.push(menu);
			}
		}
	}

    return filteredMenus;
}
