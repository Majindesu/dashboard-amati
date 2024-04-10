import exportedPermissionData, {
	SpecificPermissionCode,
} from "../../permission/data/initialPermissions";

export type RoleData = {
	code: RoleCode;
	description: string;
	isActive: boolean;
	name: string;
	permissions: SpecificPermissionCode[];
};

const roleData: RoleData[] = [
	{
		code: "super-admin",
		description:
			"Has full access to the system and can manage all features and settings",
		isActive: true,
		name: "Super Admin",
		permissions: exportedPermissionData.map(
			(x) => x.code as SpecificPermissionCode
		),
	},
];

// Manually specify the union of role codes
export type RoleCode = "super-admin" | "*";

const exportedRoleData = roleData;

export default exportedRoleData;
