import BaseError from "@/core/error/BaseError";
import applicationJsonOnly from "@/core/utils/applicationJsonOnly";
import handleCatchApi from "@/core/utils/handleCatchApi";
import nonAdminRegisterAction from "@/modules/auth/actions/nonAdminRegisterAction";
import { createUserSchema } from "@/modules/auth/formSchemas/CreateUserFormSchema";
import mapObjectToFirstValue from "@/utils/mapObjectToFirstValue";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
	try {
		applicationJsonOnly(request.headers);
		const data = createUserSchema.safeParse(await request.json());

		if (!data.success) {
			throw new BaseError({
				errorCode: "INVALID_FORM_DATA",
				message: "",
				formErrors: mapObjectToFirstValue(
					data.error.flatten().fieldErrors
				),
                statusCode: 422,
			});
		}

		const result = await nonAdminRegisterAction({
			email: data.data.email,
			name: data.data.name,
			password: data.data.password,
		});

		return NextResponse.json(result);
	} catch (e) {
		return handleCatchApi(e);
	}
}
