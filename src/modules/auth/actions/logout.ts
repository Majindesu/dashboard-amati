"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import "server-only";

/**
 * Handles user logout by deleting the authentication token and redirecting to the login page.
 * This function is intended to be used on the server side.
 *
 * @returns A promise that resolves when the logout process is complete.
 */
export default async function logout() {
	cookies().delete("token");
	redirect("/login");
}
