import db from "@/core/db";
import notFound from "@/modules/dashboard/utils/notFound";

export default async function getUserById(id: string) {
	const user = await db.user.findFirst({
		where: { id },
		select: {
			id: true,
			email: true,
			name: true,
			photoProfile: true,
			roles: {
				select: {
					code: true,
					name: true,
				},
			},
		},
	});

    if (!user) return notFound({message: "The user does not exists"})

    return user;
}
