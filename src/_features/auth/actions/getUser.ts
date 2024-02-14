"use server"

import { cookies } from "next/headers"
import "server-only"
import { decodeJwtToken, getUserFromToken } from "../authUtils";
import prisma from "@/db";
import AuthError, { AuthErrorCode } from "../AuthError";
import logout from "./logout";

export default async function getUser(){
    try {
        const token = cookies().get('token');

        if (!token) return null;

        const user = await getUserFromToken(token.value);

        if (!user) return null;

        return {
            name: user.name ?? "",
            email: user.email ?? "",
            photoUrl: user.photoProfile?.path ?? null
        }
    } catch (e: unknown){
        if (e instanceof AuthError && e.errorCode === AuthErrorCode.INVALID_JWT_TOKEN){
            return null;
        }
        throw e;
    }
}
