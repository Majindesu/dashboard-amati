"use server";

import checkPermission from "@/modules/auth/utils/checkPermission";
import ServerResponseAction from "@/modules/dashboard/types/ServerResponseAction";
import handleCatch from "@/modules/dashboard/utils/handleCatch";
import unauthorized from "@/modules/dashboard/utils/unauthorized";
import getRoleById from "../services/getRoleById";

export default async function getRoleByIdAction(id: string): Promise<ServerResponseAction<Awaited<ReturnType<typeof getRoleById>>>>{
	try{

		if (!(await checkPermission("roles.read"))) return unauthorized();

		const role = await getRoleById(id)

		return {
			success: true,
			message: "Role fetched successfully",
			data: role,
		};
	} catch (e){
		return handleCatch(e)
	}
}
