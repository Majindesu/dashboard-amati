import { cookies } from "next/headers"
import "server-only"
import { getUserFromToken } from "../authUtils";
import getCurrentUser from "./getCurrentUser";

export default async function checkPermission(permission?: "guest-only" | "authenticated-only"){
    //TODO: Add permission check


    if (!permission) return true; //allow if no permission supplied

    const user = await getCurrentUser()

    if (!user && permission === "guest-only"){
        return true;
    }

    if (user && permission === "authenticated-only"){
        return true;
    }

    return false;
}