import hashPassword from "../../src/features/auth/tools/hashPassword";
import { User, PrismaClient, Prisma } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { log } from "console";

export default async function userSeed(prisma: PrismaClient) {

    log("Seeding users...")

    const userData: Prisma.UserUncheckedCreateInput[] = [
        {
            email: "superadmin@example.com",
            name: "Super Admin",
            roles: {
                connect: {
                    code: "super-admin"
                }
            },
            passwordHash: await hashPassword("123456")
        }
    ] as const;

    await Promise.all(
        userData.map(async (user) => {
            await prisma.user.upsert({
                where: {
                    email: user.email ?? undefined
                },
                update: user,
                create: user
            })
        })
    )

    console.log("users is seeded successfully")
}
