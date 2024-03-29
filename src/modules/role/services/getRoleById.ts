import "server-only";
import db from "@/core/db";
import notFound from "@/modules/dashboard/utils/notFound";

type RoleData = {
	id: string;
	code: string;
	name: string;
	description: string;
	isActive: boolean;
	permissions: {
		id: string;
		code: string;
		name: string;
	}[];
};

export default async function getRoleById(id: string): Promise<RoleData> {
	const role = await db.role.findFirst({
		where: { id },
		select: {
			code: true,
			description: true,
			id: true,
			isActive: true,
			name: true,
			permissions: {
				select: {
					id: true,
					code: true,
					name: true,
				},
			},
		},
	});

	if (!role) return notFound({ message: "Role doesn't exists" });

	return role;
}
