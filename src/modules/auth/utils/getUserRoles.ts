import { RoleCode } from "@/modules/permission/data/initialRoles";
import getCurrentUser from "./getCurrentUser";

export default async function getUserRoles(): Promise<RoleCode[]> {
	const user = await getCurrentUser();

	if (!user) return [];

	const roles = user?.roles.map((role) => role.code);

	return roles as RoleCode[];
}
