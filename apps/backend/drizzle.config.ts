import "dotenv/config";
import type { Config } from "drizzle-kit";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
	throw new Error("DATABASE_URL is not set");
}

export default {
	schema: "./src/drizzle/schema/*",
	out: "./src/drizzle/migrations",
	dialect: "postgresql",
	dbCredentials: {
		url: databaseUrl,
	},
} satisfies Config;
