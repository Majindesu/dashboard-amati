"use client";

import logoutAction from "@/modules/auth/actions/logoutAction";
import { useEffect } from "react";

/**
 * LogoutPage component handles the logout process.
 * It checks if a user is logged in, logs them out, and redirects to the login page.
 */
export default function LogoutPage() {
	useEffect(() => {
		(async () => await logoutAction())()
			.then(() => {})
			.catch(() => {});
	}, []);

	return <div></div>;
}
