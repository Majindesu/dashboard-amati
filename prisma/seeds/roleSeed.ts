import { PrismaClient } from "@prisma/client";
import { log } from "console";
import roleData from "../../src/modules/role/data/initialRoles";

export default async function roleSeed(prisma: PrismaClient) {
	log("Seeding roles...");

	await Promise.all(
		roleData.map(async (role) => {
			await prisma.role.upsert({
				where: {
					code: role.code,
				},
				update: {
					code: role.code,
					description: role.description,
					isActive: role.isActive,
					name: role.name,
					permissions: {
						connect: role.permissions.map((permissionCode) => ({
							code: permissionCode,
						})),
					},
				},
				create: {
					code: role.code,
					description: role.description,
					isActive: role.isActive,
					name: role.name,
					permissions: {
						connect: role.permissions.map((permissionCode) => ({
							code: permissionCode,
						})),
					},
				},
			});
		})
	);

	console.log("roles is seeded successfully");
}
