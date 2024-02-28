import BaseError from "@/core/error/BaseError";
import handleCatchApi from "@/core/utils/handleCatchApi";
import AuthError from "@/modules/auth/error/AuthError";
import signInSchema from "@/modules/auth/formSchemas/signInSchema";
import signIn from "@/modules/auth/services/signIn";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
	try {
		if (request.headers.get("Content-Type") !== "application/json")
			throw new BaseError({
				errorCode: "UNSUPPORTED_CONTENT_TYPE",
				message:
					"This content type is not supported. Please use application/json instead",
                statusCode: 400
			});
		const data = signInSchema.safeParse(await request.json());

        if (!data.success){
            throw new AuthError({
                errorCode: "INVALID_CREDENTIALS",
                message: "Email or Password does not match",
                statusCode: 401
            })
        }

		const result = await signIn(data.data)

		return NextResponse.json(result);
	} catch (e) {
		return handleCatchApi(e)
	}
}
