import { cookies } from "next/headers";
import "server-only";
import getUserFromToken from "../utils/getUserFromToken";

export default async function getCurrentUser() {
	const token = cookies().get("token")?.value;

	if (!token) return null;

	const userData = await getUserFromToken(token);

	return userData;
}
