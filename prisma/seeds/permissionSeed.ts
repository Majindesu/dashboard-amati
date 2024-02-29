import permissionData from "../../src/modules/permission/data/initialPermissions";
import { PrismaClient } from "@prisma/client";
import { log } from "console";

export default async function permissionSeed(prisma: PrismaClient) {

    log("Seeding permissions...")
    
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
