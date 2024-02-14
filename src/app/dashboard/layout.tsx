import { AppShell, AppShellHeader, Burger } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Image from "next/image";
import React from "react";
import logo from "@/assets/logos/logo.png";
import DashboardLayout from "@/modules/dashboard/components/DashboardLayout";
import getUser from "@/modules/auth/actions/getUser";
import { redirect } from "next/navigation";

interface Props {
	children: React.ReactNode;
}

export default async function Layout(props: Props) {
	const user = await getUser();

	if (!user) {
		redirect("/login");
	}

	return <DashboardLayout>{props.children}</DashboardLayout>;
}
