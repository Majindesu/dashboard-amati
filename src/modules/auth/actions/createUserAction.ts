"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
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
		const result = await createUser(formData);
		cookies().set("token", result.token);
		redirect("/dashboard");
	} catch (e) {
		return handleCatch(e)
	}
}
