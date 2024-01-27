import { z } from "zod"

export interface RoleFormData {
    id: string;
    name: string;
    code: string;
    description: string;
    isActive: boolean;
}

const roleFormDataSchema = z.object({
    id: z.string().nullable(),
    name: z.string(),
    code: z.string(),
    description: z.string(),
    isActive: z.boolean(),
})

export default roleFormDataSchema;
