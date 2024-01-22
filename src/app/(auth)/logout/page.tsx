"use client"
import getUser from "@//features/auth/actions/getUser";
import logout from "@/features/auth/actions/logout";
import { redirect } from "next/navigation";
import React, { useEffect } from "react";

/**
 * LogoutPage component handles the logout process.
 * It checks if a user is logged in, logs them out, and redirects to the login page.
 */
export default function LogoutPage() {

    useEffect(() => {

        const logoutAction = async () => await logout()
        
        logoutAction()
    }, [])

	return <div></div>;
}
