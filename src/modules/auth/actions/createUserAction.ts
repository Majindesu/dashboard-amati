"use server";
import { z } from "zod";
import prisma from "@/core/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { hashPassword } from "../utils/hashPassword";
import { createJwtToken } from "../utils/createJwtToken";
import createUser from "../services/createUser";
import ServerResponseAction from "@/modules/dashboard/types/ServerResponseAction";
import handleCatch from "@/modules/dashboard/utils/handleCatch";
import { CreateUserSchema } from "../formSchemas/CreateUserFormSchema";

/**
 * Creates a new user in the system.
 *
 * @param formData - The form data containing user details.
 * @returns An object indicating the result of the operation.
 */
export default async function createUserAction(formData: CreateUserSchema): Promise<ServerResponseAction> {
	//TODO: Add Throttling
	//TODO: Add validation check if the user is already logged in

	try {
		await createUser(formData);
		redirect("/dashboard");
	} catch (e) {
		return handleCatch(e)
	}
}
