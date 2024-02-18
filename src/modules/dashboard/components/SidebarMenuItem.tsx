import React, { ReactNode, useState } from "react";

import {
	Box,
	Collapse,
	Group,
	ThemeIcon,
	UnstyledButton,
	rem,
} from "@mantine/core";
import { TbChevronRight } from "react-icons/tb";
import * as TbIcons from "react-icons/tb";

import ChildMenu from "./SidebarChildMenu";
import classNames from "./styles/sidebarMenuItem.module.css";
import SidebarMenu from "../types/SidebarMenu";

interface Props {
	menu: SidebarMenu;
}

/**
 * `MenuItem` is a React functional component that displays an individual menu item.
 * It can optionally include a collapsible sub-menu for items with children.
 *
 * @param props - The component props.
 * @param props.menu - The menu item data to display.
 * @returns A React element representing an individual menu item.
 */
export default function MenuItem({ menu }: Props) {
	const hasChildren = Array.isArray(menu.children);

	const [opened, setOpened] = useState(false);

	const toggleOpenMenu = () => {
		setOpened((prev) => !prev);
	};

	// Mapping children menu items if available
	const subItems = (hasChildren ? menu.children! : []).map((child, index) => (
		<ChildMenu key={index} item={child} />
	));

	const Icons = TbIcons as any;

	const Icon = typeof menu.icon === "string" ? Icons[menu.icon] : menu.icon;
	// const a = typeof menu.icon === "string"

	return (
		<>
			{/* Main Menu Item */}
			<UnstyledButton
				onClick={toggleOpenMenu}
				className={classNames.control}
			>
				<Group justify="space-between" gap={0}>
					{/* Icon and Label */}
					<Box style={{ display: "flex", alignItems: "center" }}>
						<ThemeIcon variant="light" size={30} color={menu.color}>
							<Icon style={{ width: rem(18), height: rem(18) }} />
						</ThemeIcon>

						<Box ml="md">{menu.label}</Box>
					</Box>

					{/* Chevron Icon for collapsible items */}
					{hasChildren && (
						<TbChevronRight
							strokeWidth={1.5}
							style={{
								width: rem(16),
								height: rem(16),
								transform: opened
									? "rotate(-90deg)"
									: "rotate(90deg)",
							}}
							className={classNames.chevron}
						/>
					)}
				</Group>
			</UnstyledButton>

			{/* Collapsible Sub-Menu */}
			{hasChildren && <Collapse in={opened}>{subItems}</Collapse>}
		</>
	);
}