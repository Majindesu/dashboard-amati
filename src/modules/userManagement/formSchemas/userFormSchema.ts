import { z } from "zod";

export interface UserFormData {
	id: string | undefined;
	name: string;
	photoProfileUrl: string;
	email: string;
	password: string | undefined;
	roles: string[]
}

const userFormDataSchema = z.object({
	id: z.string().optional(),
	name: z.string(),
	photoProfileUrl: z.union([z.string().url(), z.null(), z.string()]),
	email: z.string().email(),
	password: z.string().optional(),
	roles: z.array(z.string())
  }).refine((data) => data.id || data.password || data.password!.length >= 8, {
	message: "Password is required and must be at least 8 characters long if id is empty",
	path: ["password"],
  });
export default userFormDataSchema;
