"use server";

import db from "@/core/db";
import prisma from "@/db";
import checkPermission from "@/modules/dashboard/services/checkPermission";
import ServerResponseAction from "@/modules/dashboard/types/ServerResponseAction";
import handleCatch from "@/modules/dashboard/utils/handleCatch";
import unauthorized from "@/modules/dashboard/utils/unauthorized";

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

export default async function getRoleById(id: string): Promise<ServerResponseAction<RoleData>>{
	try{

		if (!(await checkPermission("roles.read"))) return unauthorized();

		const role = await db.role.findFirst({
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
