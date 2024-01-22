"use client";
import React, { useEffect } from "react";
import { AppShell } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import AppHeader from "../AppHeader";
import AppNavbar from "../AppNavbar";
import { useAuth } from "@/features/auth/contexts/AuthContext";

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
	// State and toggle function for handling the disclosure of the navigation bar
	const [openNavbar, { toggle }] = useDisclosure(false);

	const {fetchUserData} = useAuth();

	useEffect(() => {
		fetchUserData()
	}, [fetchUserData])

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

			<AppShell.Main className="bg-slate-100">
				{props.children}
			</AppShell.Main>
		</AppShell>
	);
}
