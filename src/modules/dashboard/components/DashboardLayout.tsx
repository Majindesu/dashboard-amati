"use client";
import React, { useEffect, useState } from "react";
import { AppShell } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import AppHeader from "./AppHeader";
import AppNavbar from "./AppNavbar";
import { useAuth } from "@/modules/auth/contexts/AuthContext";
import { usePathname } from "next/navigation";
import dashboardConfig from "../dashboard.config";

interface Props {
	children: React.ReactNode;
}

/**
 * `DashboardLayout` is a React functional component that provides a layout structure
 * for the dashboard, including a header, navigation bar, and main content area.
 *
 * @param props - The component props.
 * @param props.children - The child components to be rendered inside the layout.
 * @returns A React element representing the dashboard layout.
 */
export default function DashboardLayout(props: Props) {

	const pathname = usePathname();

	// State and toggle function for handling the disclosure of the navigation bar
	const [openNavbar, { toggle }] = useDisclosure(false);

	const {fetchUserData} = useAuth();

	const [withAppShell, setWithAppShell] = useState(false)

	useEffect(() => {
		fetchUserData()
	}, [fetchUserData])

	useEffect(() => {
		setWithAppShell(!dashboardConfig.routesWithoutAppShell.some(v => `${dashboardConfig.baseRoute}${v}` === pathname))
	}, [pathname])

	return withAppShell ? (
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

			<AppShell.Main className="bg-slate-100" styles={{main: {backgroundColor: "rgb(241 245 249)"}}}>
				{props.children}
			</AppShell.Main>
		</AppShell>
	) : props.children;
}
