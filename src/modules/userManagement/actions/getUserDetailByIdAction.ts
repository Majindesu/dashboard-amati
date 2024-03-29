"use server";
import unauthorized from "@/modules/dashboard/utils/unauthorized";
import ServerResponseAction from "@/modules/dashboard/types/ServerResponseAction";
import getUserById from "../services/getUserById";
import checkPermission from "@/modules/auth/utils/checkPermission";

type UserData = {
	id: string;
	email: string;
	name: string;
	photoProfileUrl: string;
	roles: {
		code: string,
		name: string
	}[]
};

/**
 * Retrieves detailed information of a user by their ID.
 *
 * @param id The unique identifier of the user.
 * @returns The user's detailed information or an error response.
 */
export default async function getUserDetailByIdAction(
	id: string
): Promise<ServerResponseAction<UserData>> {
	// Check user permission
	if (!checkPermission("users.read")) return unauthorized();

	// Retrieve user data from the database
	const user = await getUserById(id)

	// Format user data
	const formattedUser = {
		id: user.id,
		email: user.email ?? "",
		name: user.name ?? "",
		photoProfileUrl: user.photoProfile ?? "",
		roles: user.roles
	};

	return {
		success: true,
		data: formattedUser,
	} as const;
}
