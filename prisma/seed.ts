import { PrismaClient } from "@prisma/client";
import permissionSeed from "./seeds/permissionSeed";
import roleSeed from "./seeds/roleSeed";

const prisma = new PrismaClient();

async function main() {
	await permissionSeed(prisma);
    await roleSeed(prisma);
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
