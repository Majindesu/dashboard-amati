import { NextResponse } from "next/server";
import BaseError from "../error/BaseError";

export default function handleCatchApi(e: unknown): NextResponse {
	if (e instanceof BaseError) {
		return NextResponse.json({
			code: e.errorCode,
			message: e.message,
			formErrors: e.formErrors
		}, {status: e.statusCode});
	}
	if (e instanceof Error) {
		return NextResponse.json({
			code: "GENERAL_ERROR",
			message: e.message,
		}, {status: 500});
	}

	return NextResponse.json({
		code: "GENERAL_ERROR",
		message: "Unexpected",
	}, { status: 500 });
}
