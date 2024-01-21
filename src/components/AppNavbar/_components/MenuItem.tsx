import React, { useState } from "react";
import {
	Box,
	Collapse,
	Group,
	ThemeIcon,
	UnstyledButton,
	rem,
} from "@mantine/core";
import { MenuItem } from "../_data/allMenu";
import { TbChevronRight } from "react-icons/tb";

import classNames from "./menuItem.module.css";
import ChildMenu from "./ChildMenu";

interface Props {
	menu: MenuItem;
}

export default function MenuItem({ menu }: Props) {
	const hasChildren = Array.isArray(menu.children);

	const [opened, setOpened] = useState(false);

	const toggleOpenMenu = () => {
		setOpened((prev) => !prev);
	};

	const subItems = (hasChildren ? menu.children! : []).map((child, i) => (
		<ChildMenu key={i} item={child} />
	));

	return (
		<>
			{/* Main Section */}
			<UnstyledButton
				onClick={toggleOpenMenu}
				className={classNames.control}
			>
				<Group justify="space-between" gap={0}>
					{/* Left Section */}
					<Box style={{ display: "flex", alignItems: "center" }}>
						{/* Icon */}
						<ThemeIcon variant="light" size={30} color={menu.color}>
							<menu.icon
								style={{ width: rem(18), height: rem(18) }}
							/>
						</ThemeIcon>

						{/* Label */}
						<Box ml="md">{menu.label}</Box>
					</Box>

					{/* Right Section (Chevron if available) */}
					{hasChildren && (
						<TbChevronRight
							// stroke="1.5"
							style={{
								width: rem(16),
								height: rem(16),
								transform: opened ? "rotate(-90deg)" : "rotate(90deg)",
							}}
                            className={classNames.chevron}
						/>
					)}
				</Group>
			</UnstyledButton>
			{hasChildren ? <Collapse in={opened}>{subItems}</Collapse> : null}
		</>
	);
}
