import React from 'react';
import { AppShell, ScrollArea } from '@mantine/core';

import allMenu from "./_data/allMenu";
import MenuItem from "./_components/MenuItem";

/**
 * `AppNavbar` is a React functional component that renders the application's navigation bar.
 * It utilizes data from `allMenu` to create a list of menu items displayed in a scrollable area.
 *
 * @returns A React element representing the application's navigation bar.
 */
export default function AppNavbar() {

    // Mapping all menu items to MenuItem components
	const menus = allMenu.map((menu, i) => <MenuItem menu={menu} key={i} />);

	return (
		<AppShell.Navbar p="md">
			<ScrollArea style={{ flex: "1" }}>{menus}</ScrollArea>
		</AppShell.Navbar>
	);
}
