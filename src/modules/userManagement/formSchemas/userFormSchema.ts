import { z } from "zod";

export interface UserFormData {
	id: string | undefined;
	name: string;
	photoProfileUrl: string;
	email: string;
	password: string | undefined
}

const userFormDataSchema = z.object({
	id: z.string().optional(),
	name: z.string(),
	photoProfileUrl: z.union([z.string(), z.null()]),
	email: z.string().email(),
	password: z.string().min(8).optional(),
});

export default userFormDataSchema;
