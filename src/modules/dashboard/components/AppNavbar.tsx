import React from "react";
import { AppShell, ScrollArea } from "@mantine/core";

import MenuItem from "./SidebarMenuItem";
import { useAuth } from "@/modules/auth/contexts/AuthContext";

/**
 * `AppNavbar` is a React functional component that renders the application's navigation bar.
 * It utilizes data from `allMenu` to create a list of menu items displayed in a scrollable area.
 *
 * @returns A React element representing the application's navigation bar.
 */
export default function AppNavbar() {

	const {user} = useAuth();

	return (
		<AppShell.Navbar p="md">
			<ScrollArea style={{ flex: "1" }}>
				{
				user?.sidebarMenus.map((menu, i) => (
					<MenuItem menu={menu} key={i} />
				)) ?? null}
			</ScrollArea>
		</AppShell.Navbar>
	);
}
