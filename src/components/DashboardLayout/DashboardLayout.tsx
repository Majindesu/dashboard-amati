"use client";
import React from "react";
import { AppShell, AppShellHeader, Burger } from "@mantine/core";
import AppHeader from "../AppHeader";
import AppNavbar from "../AppNavbar";

import { useDisclosure } from "@mantine/hooks";

interface Props {
	children: React.ReactNode;
}

export default function DashboardLayout(props: Props) {
	const [openNavbar, { toggle }] = useDisclosure(false);

	return (
		<AppShell
			padding="md"
			header={{ height: 70 }}
			navbar={{
				width: 300,
				breakpoint: "sm",
				collapsed: { mobile: !openNavbar },
			}}
		>
			{/* Header */}
			<AppHeader openNavbar={openNavbar} toggle={toggle} />

			{/* Navbar */}
			<AppNavbar />

			<AppShell.Main>{props.children}</AppShell.Main>
		</AppShell>
	);
}
