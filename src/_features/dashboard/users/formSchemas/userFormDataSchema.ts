import { z } from "zod";

export interface UserFormData {
	id: string;
	name: string;
	photoProfileUrl: string;
	email: string;
}

const userFormDataSchema = z.object({
	id: z.string().nullable(),
	name: z.string(),
	photoProfileUrl: z.union([z.string(), z.null()]),
	email: z.string().email(),
});

export default userFormDataSchema;
