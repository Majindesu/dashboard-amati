import guestOnly from "@/modules/auth/actions/guestOnly";
import React from "react";

interface Props {
	children: React.ReactNode;
}

export default async function RegisterLayout({ children }: Props) {
	await guestOnly();

	return <>{children}</>;
}
