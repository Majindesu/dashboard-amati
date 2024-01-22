import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";
import "@mantine/core/styles.css";

import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { AuthContextProvider } from "@/features/auth/contexts/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Create Next App",
	description: "Generated by create next app",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<head>
				<ColorSchemeScript />
			</head>
			<body className={inter.className}>
				<MantineProvider>
					<AuthContextProvider>{children}</AuthContextProvider>
				</MantineProvider>
			</body>
		</html>
	);
}
