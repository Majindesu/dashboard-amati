import unauthorized from "@/modules/dashboard/utils/unauthorized";
import checkPermission from "../utils/checkPermission";
import nonAdminRegisterFormType from "../types/NonAdminRegisterFormType";
import db from "@/core/db";
import AuthError from "../error/AuthError";
import hashPassword from "../utils/hashPassword";
import "server-only";
import { createJwtToken } from "../utils/createJwtToken";

export default async function nonAdminRegister(data: nonAdminRegisterFormType) {
	if (!(await checkPermission("guest-only"))) unauthorized();

	const existingUser = await db.user.findFirst({
		where: {
			email: data.email,
		},
	});

	if (existingUser)
		throw new AuthError({
			errorCode: "USER_ALREADY_EXISTS",
			message:
				'This email has been registered before. If you forgot your password, you can click "Forgot Password"',
			statusCode: 401,
		});

	const user = await db.user.create({
		data: {
			email: data.email,
			name: data.name,
			passwordHash: await hashPassword(data.password),
		},
	});

    const token = createJwtToken({id: user.id})

	return {user, token };
}
