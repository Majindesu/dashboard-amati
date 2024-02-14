import { cache } from "react";
import decodeJwtToken from "./decodeJwtToken";
import prisma from "@/core/db";

/**
 * Retrieves user data from the database based on the provided JWT token.
 *
 * This function decodes the JWT token to extract the user ID, and then queries the database using Prisma
 * to fetch the user's details, including the profile photo, roles, and direct permissions.
 *
 * @param token - The JWT token containing the user's ID.
 * @returns The user's data if the user exists, or null if no user is found.
 * Throws an error if the token is invalid or the database query fails.
 */
const getUserFromToken = cache(async (token: string) => {
	// Decode the JWT token to extract the user ID
	const decodedToken = decodeJwtToken(token) as { id: string; iat: number };

	// Fetch the user from the database
	const user = await prisma.user.findFirst({
		include: {
			roles: true,
			directPermissions: true,
		},
		where: {
			id: decodedToken.id,
		},
	});

	return user;
});

export default getUserFromToken;
