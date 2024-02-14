"use server"
import "server-only";
import prisma from "@/db";
import checkPermission from "@/modules/dashboard/services/checkPermission";
import unauthorized from "@/modules/dashboard/utils/unauthorized";
import ServerResponseAction from "@/modules/dashboard/types/ServerResponseAction";

type UserData = {
	id: string,
	email: string,
	name: string,
	photoProfileUrl: string
}

/**
 * Retrieves detailed information of a user by their ID.
 *
 * @param id The unique identifier of the user.
 * @returns The user's detailed information or an error response.
 */
export default async function getUserDetailById(id: string): Promise<ServerResponseAction<UserData>> {
	// Check user permission
	if (!checkPermission("users.read")) return unauthorized();

	// Retrieve user data from the database
	const user = await prisma.user.findFirst({
		where: { id },
		select: {
			id: true,
			email: true,
			name: true,
			photoProfile: true,
		},
	});

	// Check if user exists
	if (!user)
		return {
			success: false,
			message: "User not found",
		} as const;

	// Format user data
	const formattedUser = {
		id: user.id,
		email: user.email ?? "",
		name: user.name ?? "",
		photoProfileUrl: user.photoProfile ?? "",
	};

	return {
		success: true,
		message: "Permission fetched successfully",
		data: formattedUser,
	} as const;
}
