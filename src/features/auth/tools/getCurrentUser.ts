import { cache } from "react"
import "server-only"
import { getUserFromToken } from "../authUtils"
import { cookies } from "next/headers"

const getCurrentUser = cache(async () => {
    const token = cookies().get("token")?.value;
    if(!token) return null;

    const user = await getUserFromToken(token);

    if (!user) return null;

    return user;
})

export default getCurrentUser;
