import { unauthorized } from "@/BaseError"
import prisma from "@/db";
import checkPermission from "@/features/auth/tools/checkPermission"
import "server-only"

const getUsers = async () => {

    if (!await checkPermission("authenticated-only")) unauthorized();

    const users = await prisma.user.findMany({
        select: {
            id: true,
            email: true,
            photoProfile: {
                select: {
                    path: true
                }
            },
            name: true,
        },
    })

    const result = users.map((user) => ({
        ...user,
        photoUrl: user.photoProfile?.path ?? null,
        photoProfile: undefined
    }))

    return result;
}

export default getUsers;
