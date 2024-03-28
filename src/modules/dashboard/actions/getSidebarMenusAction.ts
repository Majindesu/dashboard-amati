"use server";
import "server-only";
import SidebarMenu from "../types/SidebarMenu";
import ServerResponseAction from "../types/ServerResponseAction";
import handleCatch from "../utils/handleCatch";
import getSidebarMenus from "../services/getSidebarMenus";

export default async function getSidebarMenusAction(): Promise<
	ServerResponseAction<SidebarMenu[]>
> {
	try {
		
		const filteredMenus = await getSidebarMenus();

		return {
			success: true,
			data: filteredMenus,
		};
	} catch (e) {
		return handleCatch(e);
	}
}
