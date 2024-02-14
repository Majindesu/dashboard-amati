import getCurrentUser from "./getCurrentUser";

export default async function getUserRoles() {
	const user = await getCurrentUser();

	if (!user) return [];

	const roles = user?.roles.map((role) => role.code);

	return roles;
}
