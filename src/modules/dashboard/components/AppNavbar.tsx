import React, { useEffect, useState } from "react";
import { AppShell, ScrollArea, Skeleton, Stack } from "@mantine/core";

import MenuItem from "./SidebarMenuItem";
import getSidebarMenus from "../actions/getSidebarMenus";
import withServerAction from "../utils/withServerAction";
import SidebarMenu from "../types/SidebarMenu";

/**
 * `AppNavbar` is a React functional component that renders the application's navigation bar.
 * It utilizes data from `allMenu` to create a list of menu items displayed in a scrollable area.
 *
 * @returns A React element representing the application's navigation bar.
 */
export default function AppNavbar() {
	const [isFetching, setFetching] = useState(true);
	const [sidebarMenus, setSidebarMenus] = useState<SidebarMenu[]>([]);

	// Mapping all menu items to MenuItem components
	// const menus = getSidebarMenus().map((menu, i) => <MenuItem menu={menu} key={i} />);
	useEffect(() => {
		setFetching(true);
		withServerAction(getSidebarMenus)
			.then((response) => {
				setSidebarMenus(response.data);
			})
			.catch((e) => {
				console.error(e);
			})
			.finally(() => {
				setFetching(false);
			});
	}, []);

	return (
		<AppShell.Navbar p="md">
			<ScrollArea style={{ flex: "1" }}>
				{
				isFetching ? <Stack gap="md">
					{[...new Array(10)].map((_,i) => <Skeleton key={i} visible={true} height={40} width={"100%"} />)}
				</Stack> :
				sidebarMenus.map((menu, i) => (
					<MenuItem menu={menu} key={i} />
				))}
			</ScrollArea>
		</AppShell.Navbar>
	);
}
