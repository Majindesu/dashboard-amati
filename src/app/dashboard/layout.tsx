import { MantineProvider } from "@mantine/core";
import React from "react";
import DashboardLayout from "@/modules/dashboard/components/DashboardLayout";
import { Notifications } from "@mantine/notifications";
import getCurrentUser from "@/modules/auth/services/getCurrentUser";
import { AuthContextProvider } from "@/modules/auth/contexts/AuthContext";
import getSidebarMenus from "@/modules/dashboard/services/getSidebarMenus";

interface Props {
	children: React.ReactNode;
}

export default async function Layout(props: Props) {
	const user = (await getCurrentUser());

	// if (!user) {
	// 	redirect("/dashboard/login");
	// }

	const userData = user ? {
		id: user.id,
		name: user.name ?? "",
		email: user.email ?? "",
		photoProfile: user.photoProfile,
		sidebarMenus: await getSidebarMenus()
	} : null;

	return (
		<MantineProvider>
			<Notifications />
			<AuthContextProvider userData={userData}>
				<DashboardLayout isLoggedIn={!!user}>{props.children}</DashboardLayout>
			</AuthContextProvider>
		</MantineProvider>
	);
}
