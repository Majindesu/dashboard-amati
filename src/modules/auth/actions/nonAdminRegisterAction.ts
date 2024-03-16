"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ServerResponseAction from "@/modules/dashboard/types/ServerResponseAction";
import handleCatch from "@/modules/dashboard/utils/handleCatch";
import nonAdminRegisterFormType from "../types/NonAdminRegisterFormType";
import nonAdminRegister from "../services/nonAdminRegister";

/**
 * Creates a new user in the system.
 *
 * @param formData - The form data containing user details.
 * @returns An object indicating the result of the operation.
 */
export default async function nonAdminRegisterAction(
	formData: nonAdminRegisterFormType
): Promise<ServerResponseAction> {
	//TODO: Add Throttling

	try {
		const result = await nonAdminRegister(formData);
		cookies().set("token", result.token);
		redirect("/dashboard");
	} catch (e) {
		return handleCatch(e);
	}
}
