"use server";

import prisma from "@/db";
import checkPermission from "@/features/auth/tools/checkPermission";
import { handleCatch, notFound, unauthorized } from "../../errors/DashboardError";
import ServerResponse from "@/types/Action";

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
    }[]
}

export default async function getRoleById(id: string): Promise<ServerResponse<RoleData>>{
	try{

		if (!(await checkPermission("role.read"))) return unauthorized();

		const role = await prisma.role.findFirst({
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

		if (!role) {
			throw new Error("Permission not found")
		}

		return {
			success: true,
			message: "Role fetched successfully",
			data: role,
		};
	} catch (e){
		return handleCatch(e)
	}
}
