import { z } from "zod";
const envVariables = z.object({ 
    DATABASE_URL: z.string(), 
    JWT_SECRET: z.string(),
    WS_PORT: z.string(),
    WS_HOST: z.string()
});
envVariables.parse(process.env);

declare global {
	namespace NodeJS {
		interface ProcessEnv extends z.infer<typeof envVariables> {}
	}
}

