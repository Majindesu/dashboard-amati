"use server"

import { cookies } from "next/headers"
import "server-only"
import { decodeJwtToken } from "../authUtils";
import prisma from "@/db";
import AuthError, { AuthErrorCode } from "../AuthError";
import logout from "./logout";

export default async function getUser(){
    try {
        const token = cookies().get('token');

        if (!token) return null;

        const decodedToken = decodeJwtToken(token.value) as {id: string, iat: number};
        console.log('token', decodedToken)

        const user = await prisma.user.findFirst({
            where: {
                id: decodedToken.id
            }
        });

        return user;
    } catch (e: unknown){
        if (e instanceof AuthError && e.errorCode === AuthErrorCode.INVALID_JWT_TOKEN){
            return null;
        }
        throw e;
    }
}
