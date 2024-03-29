import { Role } from "@prisma/client";

const roleData = [
	{
		code: "super-admin",
		description:
			"Has full access to the system and can manage all features and settings",
		isActive: true,
		name: "Super Admin",
	},
] as const;

export type RoleCode = (typeof roleData)[number]["code"] | "*";

const exportedRoleData = roleData as unknown as Omit<Role, "id">;

export default exportedRoleData;
