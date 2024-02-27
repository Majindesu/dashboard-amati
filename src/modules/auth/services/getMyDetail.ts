import { cookies } from "next/headers";
import getUserFromToken from "../utils/getUserFromToken";

export default async function getMyDetail() {
	const token = cookies().get("token");

	if (!token) return null;

	const user = await getUserFromToken(token.value);

	if (!user) return null;

	return {
		name: user.name ?? "",
		email: user.email ?? "",
		photoUrl: user.photoProfile ?? null,
	};
}
