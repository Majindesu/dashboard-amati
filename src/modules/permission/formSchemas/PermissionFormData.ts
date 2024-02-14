import { z } from "zod"

export interface PermissionFormData {
    id: string;
    name: string;
    code: string;
    description: string;
    isActive: boolean;
}

const permissionFormDataSchema = z.object({
    id: z.string().nullable(),
    name: z.string().min(1),
    code: z.string().min(1),
    description: z.string(),
    isActive: z.boolean(),
})

export default permissionFormDataSchema;
