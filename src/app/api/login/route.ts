import applicationJsonOnly from "@/core/utils/applicationJsonOnly";
import handleCatchApi from "@/core/utils/handleCatchApi";
import AuthError from "@/modules/auth/error/AuthError";
import signInSchema from "@/modules/auth/formSchemas/signInSchema";
import signIn from "@/modules/auth/services/signIn";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
	try {
		applicationJsonOnly(request.headers)
		const data = signInSchema.safeParse(await request.json());

        if (!data.success){
            throw new AuthError({
                errorCode: "INVALID_CREDENTIALS",
                message: "Email or Password does not match",
                statusCode: 401
            })
        }

		const result = await signIn(data.data)

		request.cookies.set("token", result.token)

		return NextResponse.json(result);
	} catch (e) {
		return handleCatchApi(e)
	}
}
