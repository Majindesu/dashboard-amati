import { cache } from "react"
import "server-only"
import getUserFromToken from "./getUserFromToken"
import { cookies, headers } from "next/headers"
import getTokenFromHeaders from "./getTokenFromHeaders"

/**
 * Retrieves the current user based on the JWT token stored in cookies.
 * This function is intended to run on the server side in a Next.js application.
 * It reads the JWT token from the cookies, decodes it to get the user ID,
 * and then fetches the corresponding user data from the database.
 *
 * @returns The current user's data if the user is authenticated and found in the database, otherwise null.
 */
const getCurrentUser = async () => {
    // Retrieve the token from cookies
    const token = cookies().get("token")?.value ?? getTokenFromHeaders(headers());

    // If no token is found, return null (no current user)
    if(!token) return null;

    // Use the token to get the user from the database
    const user = await getUserFromToken(token);

    // Return the user if found, otherwise return null
    return user ? user : null;
}

export default getCurrentUser;
