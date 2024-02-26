"use server";
import { z } from "zod";
import prisma from "@/core/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { hashPassword } from "../utils/hashPassword";
import { createJwtToken } from "../utils/createJwtToken";
import createUser from "../services/createUser";

/**
 * Creates a new user in the system.
 *
 * @param formData - The form data containing user details.
 * @returns An object indicating the result of the operation.
 */
export default async function createUserAction(formData: FormData) {
	//TODO: Add Throttling
	//TODO: Add validation check if the user is already logged in

	try {
		const parsedData = {
			email: formData.get("email")?.toString() ?? "",
			name: formData.get("name")?.toString() ?? "",
			plainPassword: formData.get("password")?.toString() ?? "",
			plainPasswordConfirmation:
				formData.get("passwordConfirmation")?.toString() ?? "",
		};
		await createUser(parsedData);
		redirect("/dashboard");
	} catch (e: unknown) {
		// Handle unexpected errors
		console.error(e);
		//@ts-ignore
		console.log(e.message);
		return {
			success: false,
			error: {
				message:
					"An unexpected error occurred on the server. Please try again or contact the administrator.",
			},
		};
	}
}
