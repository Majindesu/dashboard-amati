import React from "react";

import guestOnly from "@/features/auth/actions/guestOnly";

interface Props {
	children: React.ReactNode;
}

export default async function RegisterLayout({ children }: Props) {

    await guestOnly()

	return <>{children}</>;
}
