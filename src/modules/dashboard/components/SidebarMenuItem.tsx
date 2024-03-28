import React, { useState } from "react";

import {
	Box,
	Collapse,
	Group,
	ThemeIcon,
	UnstyledButton,
	alpha,
	rem,
	useMantineTheme,
} from "@mantine/core";
import { TbChevronRight } from "react-icons/tb";
import * as TbIcons from "react-icons/tb";

import ChildMenu from "./SidebarChildMenu";
import classNames from "./styles/sidebarMenuItem.module.css";
import SidebarMenu from "../types/SidebarMenu";
import dashboardConfig from "../dashboard.config";
import { usePathname } from "next/navigation";
import areURLsSame from "@/utils/areUrlSame";

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

	const pathname = usePathname()

	const theme = useMantineTheme();

	const [opened, setOpened] = useState(menu.children?.some(child => areURLsSame(`${dashboardConfig.baseRoute}${child.link}`, pathname)) ?? false);

	const toggleOpenMenu = () => {
		setOpened((prev) => !prev);
	};

	// Mapping children menu items if available
	const subItems = (hasChildren ? menu.children! : []).map((child, index) => (
		<ChildMenu key={index} item={child} active={areURLsSame(`${dashboardConfig.baseRoute}${child.link}`, pathname)} />
	));

	const Icons = TbIcons as any;

	const Icon = typeof menu.icon === "string" ? Icons[menu.icon] : menu.icon;

	const isActive = areURLsSame(`${dashboardConfig.baseRoute}${menu.link}`, pathname)

	return (
		<>
			{/* Main Menu Item */}
			<UnstyledButton<"a" | "button">
				onClick={toggleOpenMenu}
				className={classNames.control}
				href={menu.link ? dashboardConfig.baseRoute + menu.link : ""}
				component={menu.link ? "a" : "button"}
			>
				<Group justify="space-between" gap={0}>
					{/* Icon and Label */}
					<Box style={{ display: "flex", alignItems: "center" }}>
						<ThemeIcon variant="light" size={30} color={menu.color}>
							<Icon style={{ width: rem(18), height: rem(18) }} />
						</ThemeIcon>

						<Box ml="md" fw={isActive ? 700 : 500}>{menu.label}</Box>
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
