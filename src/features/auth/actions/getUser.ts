"use server"

import { cookies } from "next/headers"
import "server-only"
import { decodeJwtToken } from "../authUtils";
import prisma from "@/db";

export default async function getUser(){
    const token = cookies().get('token');

    if (!token) return null;

    const decodedToken = decodeJwtToken(token.value) as {id: string, iat: number};

    const user = await prisma.user.findFirst({
        where: {
            id: decodedToken.id
        }
    });

    return user;
}
