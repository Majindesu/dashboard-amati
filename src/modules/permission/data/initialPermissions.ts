import { Permission } from "@prisma/client";

const permissionData = [
	// Permission group
	{
		code: "permissions.create",
		name: "Create permission",
		description: "Allows creating a single permission",
		isActive: true,
	},
	{
		code: "permissions.read",
		name: "Read permission",
		description: "Allows reading a single permission",
		isActive: true,
	},
	{
		code: "permissions.readAll",
		name: "Read all permissions",
		description: "Allows reading all permissions",
		isActive: true,
	},
	{
		code: "permissions.update",
		name: "Update permission",
		description: "Allows updating a permission",
		isActive: true,
	},
	{
		code: "permissions.delete",
		name: "Delete permission",
		description: "Allows deleting a permission",
		isActive: true,
	},
	// Role group
	{
		code: "roles.create",
		name: "Create role",
		description: "Allows creating a single role",
		isActive: true,
	},
	{
		code: "roles.read",
		name: "Read role",
		description: "Allows reading a single role",
		isActive: true,
	},
	{
		code: "roles.readAll",
		name: "Read all roles",
		description: "Allows reading all roles",
		isActive: true,
	},
	{
		code: "roles.update",
		name: "Update role",
		description: "Allows updating a role",
		isActive: true,
	},
	{
		code: "roles.delete",
		name: "Delete role",
		description: "Allows deleting a role",
		isActive: true,
	},
	// User group
	{
		code: "users.create",
		name: "Create user",
		description: "Allows creating a user",
		isActive: true,
	},
	{
		code: "users.read",
		name: "Read user",
		description: "Allows reading a single user",
		isActive: true,
	},
	{
		code: "users.readAll",
		name: "Read all users",
		description: "Allows reading all users",
		isActive: true,
	},
	{
		code: "users.update",
		name: "Update user",
		description: "Allows updating a user",
		isActive: true,
	},
	{
		code: "users.delete",
		name: "Delete user",
		description: "Allows deleting a user",
		isActive: true,
	},

	//Promos
	{
		code: "promos.readAll",
		name: "Read all promos",
	},
] as const;

export type SpecificPermissionCode = (typeof permissionData)[number]["code"];

export type PermissionCode =
	| SpecificPermissionCode
	| "*"
	| "authenticated-only"
	| "guest-only";

const exportedPermissionData = permissionData as unknown as Omit<
	Permission,
	"id"
>[];

export default exportedPermissionData;
