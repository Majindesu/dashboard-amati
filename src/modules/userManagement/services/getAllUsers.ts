import db from "@/core/db";
import "server-only";

const getAllUsers = async () => {
	const users = await db.user.findMany({
		select: {
			id: true,
			email: true,
			photoProfile: true,
			name: true,
			roles: {
				select: {
					name: true,
					code: true,
				},
			},
		},
	});

	const result = users.map((user) => ({
		...user,
		photoUrl: user.photoProfile ?? null,
		photoProfile: undefined,
	}));

	return result;
};

export default getAllUsers;
