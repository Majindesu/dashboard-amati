import { Role, PrismaClient } from "@prisma/client";
import { log } from "console";

export default async function roleSeed(prisma: PrismaClient) {

    log("Seeding roles...")

    const roleData: Omit<Role, "id">[] = [
        {
            code: "super-admin",
            description: "Has full access to the system and can manage all features and settings",
            isActive: true,
            name: "Super Admin"
        }
    ];

    await Promise.all(
        roleData.map(async (role) => {
            await prisma.role.upsert({
                where: {
                    code: role.code
                },
                update: role,
                create: role
            })
        })
    )

    console.log("roles is seeded successfully")
}
