import { Permission, PrismaClient } from "@prisma/client";
import { log } from "console";

export default async function permissionSeed(prisma: PrismaClient) {

    log("Seeding permissions...")

    const permissionData: Omit<Permission, "id">[] = [
        // Permission group
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
        {
            code: "office-365-request.create",
            name: "Create Office 365 Request",
            description: "Allows create an Office 365 Reseller Request",
            isActive: true
        },
        {
            code: "office-365-request.getMine",
            name: "Get my Office 365 Requests",
            description: "Allows retrieve user's Office 365 Link Requests",
            isActive: true
        }
    ];
    
    await Promise.all(
        permissionData.map(async (permission) => {
            await prisma.permission.upsert({
                where: {
                    code: permission.code
                },
                update: permission,
                create: permission
            })
        })
    )

    console.log("Permission is seeded successfully")
}
