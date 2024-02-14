"use server";
import {
	TbLayoutDashboard,
	TbUsers,
	TbNotebook,
	TbShoppingBag,
	TbPhotoFilled,
} from "react-icons/tb";
import SidebarMenu from "../types/SidebarMenu";
import "server-only";
import getCurrentUser from "@/modules/auth/utils/getCurrentUser";
import ServerResponseAction from "../types/ServerResponseAction";
import handleCatch from "../utils/handleCatch";
import getUserRoles from "@/modules/auth/utils/getUserRoles";
import getUserPermissions from "@/modules/auth/utils/getUserPermissions";
import sidebarMenus from "../data/sidebarMenus";

export default async function getSidebarMenus(): Promise<
	ServerResponseAction<SidebarMenu[]>
> {
	try {
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
						menuChild.allowedRoles?.includes("*")
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

		return {
			success: true,
			data: filteredMenus,
		};
	} catch (e) {
		return handleCatch(e);
	}
}
